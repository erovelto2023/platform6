import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pipeline, projectId, inputs } = body;

  if (!pipeline || !projectId) {
    return NextResponse.json({ error: 'Pipeline type and projectId are required' }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        if (pipeline === 'braindump-to-dossier') {
          const LOCAL_MODEL = 'qwen3.5:latest';
          const steps = [
            { id: 'genre', name: 'Identify Genre', model: LOCAL_MODEL },
            { id: 'brainstorm', name: 'Brainstorm Pitches', model: LOCAL_MODEL },
            { id: 'evaluate', name: 'Evaluate & Pick Best', model: LOCAL_MODEL },
            { id: 'extract', name: 'Extract Winning Pitch', model: LOCAL_MODEL },
            { id: 'build', name: 'Build Story Dossier', model: LOCAL_MODEL },
            { id: 'critique_emotion', name: 'Emotional Critique', model: LOCAL_MODEL },
            { id: 'critique_name', name: 'Character Name Critique', model: LOCAL_MODEL },
            { id: 'rewrite_1', name: 'Dossier Rewrite (Round 1)', model: LOCAL_MODEL },
            { id: 'critique_logic', name: 'Logic Critique', model: LOCAL_MODEL },
            { id: 'rewrite_final', name: 'Final Dossier Rewrite', model: LOCAL_MODEL }
          ];

          let context = `User Braindump: ${inputs?.logline || 'None provided'}\nPreferred Genre: ${inputs?.genre || 'Not specified'}\nTropes: ${inputs?.tropes || 'None'}`;

          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            sendEvent('step_start', { stepIndex: i, step: step.id, name: step.name, model: step.model });

            let prompt = '';
            switch(step.id) {
              case 'genre': prompt = `Identify the core genre and subgenres based on this braindump. Keep it brief (under 50 words).\n\nContext:\n${context}`; break;
              case 'brainstorm': prompt = `Brainstorm 2 unique story pitches based on the previous context. Keep each pitch under 100 words.\n\nContext:\n${context}`; break;
              case 'evaluate': prompt = `Evaluate the pitches and pick the best one. Briefly explain why in 50 words.\n\nContext:\n${context}`; break;
              case 'extract': prompt = `Extract ONLY the winning pitch into a single cohesive paragraph.\n\nContext:\n${context}`; break;
              case 'build': prompt = `Expand the winning pitch into a short Story Dossier with 'Characters' and 'Worldbuilding' sections.\n\nContext:\n${context}`; break;
              case 'critique_emotion': prompt = `Critique the emotional stakes of the Story Dossier in 50 words. What's missing?\n\nContext:\n${context}`; break;
              case 'critique_name': prompt = `Suggest 3 better alternative names for the main characters.\n\nContext:\n${context}`; break;
              case 'rewrite_1': prompt = `Rewrite the Story Dossier incorporating the emotional critique and new names. Keep it under 150 words.\n\nContext:\n${context}`; break;
              case 'critique_logic': prompt = `Analyze the rewritten dossier for any logical plot holes in 50 words.\n\nContext:\n${context}`; break;
              case 'rewrite_final': prompt = `Present the final polished Story Dossier, fixing any plot holes. Format with markdown headers.\n\nContext:\n${context}`; break;
            }

            try {
              const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: LOCAL_MODEL,
                  prompt: prompt,
                  stream: true,
                  options: {
                    num_predict: 250 // keep it short so 10 local generations don't take forever
                  }
                })
              });

              if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
              }

              const reader = response.body?.getReader();
              const decoder = new TextDecoder();
              let accumulated = '';
              let evalTokens = 0;
              let evalDuration = 0;

              if (reader) {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  
                  const chunkStr = decoder.decode(value, { stream: true });
                  const lines = chunkStr.split('\n').filter(l => l.trim());
                  
                  for (const line of lines) {
                    try {
                      const parsed = JSON.parse(line);
                      if (parsed.response) {
                        accumulated += parsed.response;
                        sendEvent('step_chunk', { stepIndex: i, text: accumulated });
                      }
                      if (parsed.done) {
                        evalTokens = parsed.eval_count || 0;
                        evalDuration = (parsed.eval_duration || 0) / 1000000000; // convert ns to s
                      }
                    } catch (e) {
                      console.error('Error parsing JSON from Ollama:', e);
                    }
                  }
                }
              }

              // Append to context for the next step, keep context from growing too massive
              context += `\n\n=== Output from ${step.name} ===\n${accumulated}`;
              if (context.length > 5000) {
                 context = context.substring(context.length - 5000);
              }

              const timeStr = evalDuration > 0 ? `${evalDuration.toFixed(1)}s` : '0s';
              sendEvent('step_complete', { stepIndex: i, time: timeStr, tokens: evalTokens });

            } catch (ollamaErr: any) {
              console.error('Ollama connection failed:', ollamaErr);
              sendEvent('step_error', { stepIndex: i, error: 'Failed to connect to local Ollama instance.' });
              break; // Stop pipeline on error
            }
          }
          
          sendEvent('pipeline_complete', { success: true });
        } else {
          sendEvent('step_error', { stepIndex: 0, error: 'Pipeline not implemented yet.' });
        }
      } catch (err: any) {
        console.error('SSE Error:', err);
        sendEvent('step_error', { stepIndex: -1, error: err.message });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
