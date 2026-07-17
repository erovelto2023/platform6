"use client";

import React, { useEffect, useRef } from 'react';
import parse, { attributesToProps, domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';

// beUI Components
import { TiltCard } from "@/components/motion/tilt-card";
import { Marquee } from "@/components/motion/marquee";
import { MagneticButton } from "@/components/motion/button/magnetic";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Checkbox } from "@/components/motion/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/motion/select";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";

interface CustomHTMLRendererProps {
    html: string;
    className?: string;
}

// Wrapper for the Checkbox to hold state when rendered from raw HTML
const CheckboxWrapper = ({ initialChecked = false, label, className }: any) => {
    const [checked, setChecked] = React.useState(initialChecked);
    return (
        <Checkbox 
            checked={checked} 
            onCheckedChange={setChecked} 
            label={label} 
            className={className} 
        />
    );
};

export const CustomHTMLRenderer: React.FC<CustomHTMLRendererProps> = ({ html, className }) => {
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // We define the parser options inside the component to return React elements
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                const props = attributesToProps(domNode.attribs);
                const children = domNode.children ? domToReact(domNode.children as any, options) : null;

                // React throws an error if it encounters lowercase inline event handlers (like onchange="...").
                // Since inline string event handlers don't work in React anyway, we strip them.
                let hasInlineEvent = false;
                for (const key in props) {
                    if (key.startsWith('on') && typeof props[key] === 'string') {
                        delete props[key];
                        hasInlineEvent = true;
                    }
                }
                
                // If we don't return here, the parser will ignore our modified `props` and render the original.
                // However, we only return here if it's NOT a custom tag, otherwise our custom logic below won't run.
                const customTags = [
                    'tilt-card', 'magnetic-button', 'marquee', 'scroll-reveal', 'checkbox', 
                    'motion-select', 'motion-select-trigger', 'motion-select-value', 'motion-select-content', 'motion-select-item',
                    'button', 'input', 'textarea', 'label', 'badge',
                    'card', 'card-header', 'card-title', 'card-description', 'card-content', 'card-footer',
                    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption'
                ];

                const standardTags = new Set([
                    'div', 'span', 'p', 'a', 'b', 'i', 'u', 's', 'em', 'strong', 'small', 'big', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'col', 'colgroup',
                    'form', 'button', 'input', 'textarea', 'select', 'option', 'optgroup', 'label', 'fieldset', 'legend',
                    'header', 'footer', 'main', 'nav', 'section', 'article', 'aside', 'figure', 'figcaption', 'details', 'summary',
                    'img', 'video', 'audio', 'source', 'iframe', 'canvas', 'svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon', 'polyline', 'defs', 'use',
                    'br', 'hr', 'code', 'pre', 'blockquote', 'q', 'cite', 'abbr', 'address', 'time', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo',
                    'map', 'area', 'track', 'embed', 'object', 'param', 'picture', 'meter', 'progress', 'output', 'keygen', 'math'
                ]);

                if (hasInlineEvent && !customTags.includes(domNode.name)) {
                    // Only return React.createElement if it's a known standard tag to avoid React warnings
                    if (standardTags.has(domNode.name) || domNode.name.includes('-')) {
                        return React.createElement(domNode.name, props, children);
                    }
                }

                // If it's not a mapped custom tag, not a standard HTML/SVG tag, and doesn't have a hyphen (web component)
                // then it's almost certainly an accidentally pasted React component (like <Smartphone /> -> <smartphone>)
                // We silently ignore it to prevent React from throwing "unrecognized in this browser" warnings.
                if (!customTags.includes(domNode.name) && !standardTags.has(domNode.name) && !domNode.name.includes('-')) {
                    return <React.Fragment>{children}</React.Fragment>;
                }

                // --- Auto-Upgrade Standard HTML & Custom Elements to Shadcn UI ---
                if (domNode.name === 'button') {
                    return <Button {...props} variant={props.variant as any || 'default'} size={props.size as any || 'default'}>{children}</Button>;
                }
                if (domNode.name === 'input') {
                    return <Input {...props} type={props.type as string || 'text'} />;
                }
                if (domNode.name === 'textarea') {
                    return <Textarea {...props} />;
                }
                if (domNode.name === 'label') {
                    return <Label {...props}>{children}</Label>;
                }
                if (domNode.name === 'badge') {
                    return <Badge {...props} variant={props.variant as any || 'default'}>{children}</Badge>;
                }
                
                // Shadcn Card Suite
                if (domNode.name === 'card') return <Card {...props}>{children}</Card>;
                if (domNode.name === 'card-header') return <CardHeader {...props}>{children}</CardHeader>;
                if (domNode.name === 'card-title') return <CardTitle {...props}>{children}</CardTitle>;
                if (domNode.name === 'card-description') return <CardDescription {...props}>{children}</CardDescription>;
                if (domNode.name === 'card-content') return <CardContent {...props}>{children}</CardContent>;
                if (domNode.name === 'card-footer') return <CardFooter {...props}>{children}</CardFooter>;

                // Auto-Upgrade Standard HTML Tables to Shadcn Table
                if (domNode.name === 'table') return <Table {...props}>{children}</Table>;
                if (domNode.name === 'thead') return <TableHeader {...props}>{children}</TableHeader>;
                if (domNode.name === 'tbody') return <TableBody {...props}>{children}</TableBody>;
                if (domNode.name === 'tfoot') return <TableFooter {...props}>{children}</TableFooter>;
                if (domNode.name === 'tr') return <TableRow {...props}>{children}</TableRow>;
                if (domNode.name === 'th') return <TableHead {...props}>{children}</TableHead>;
                if (domNode.name === 'td') return <TableCell {...props}>{children}</TableCell>;
                if (domNode.name === 'caption') return <TableCaption {...props}>{children}</TableCaption>;

                // --- Map custom tags to our Shadcn/beUI React components ---
                if (domNode.name === 'tilt-card') {
                    // Extract props specifically meant for TiltCard
                    const tiltMax = props['max'] ? Number(props['max']) : 12;
                    const glare = props['glare'] !== 'false'; // default true
                    
                    return (
                        <TiltCard max={tiltMax} glare={glare} className={props.className as string}>
                            {children}
                        </TiltCard>
                    );
                }

                if (domNode.name === 'magnetic-button') {
                    return (
                        <MagneticButton 
                            variant={props.variant as any || 'primary'} 
                            size={props.size as any || 'md'}
                            className={props.className as string}
                        >
                            {children}
                        </MagneticButton>
                    );
                }

                if (domNode.name === 'marquee') {
                    const speed = props['speed'] ? Number(props['speed']) : 30;
                    return (
                        <Marquee speed={speed} className={props.className as string}>
                            {children}
                        </Marquee>
                    );
                }

                if (domNode.name === 'scroll-reveal') {
                    const y = props['y'] ? Number(props['y']) : 16;
                    const blur = props['blur'] ? Number(props['blur']) : 8;
                    const delay = props['delay'] ? Number(props['delay']) : 0;
                    return (
                        <ScrollReveal y={y} blur={blur} delay={delay} className={props.className as string}>
                            {children}
                        </ScrollReveal>
                    );
                }

                if (domNode.name === 'checkbox') {
                    return (
                        <CheckboxWrapper 
                            initialChecked={props['checked'] === 'true'} 
                            label={props['label'] as string} 
                            className={props.className as string} 
                        />
                    );
                }

                if (domNode.name === 'motion-select') {
                    return <Select>{children}</Select>;
                }
                if (domNode.name === 'motion-select-trigger') {
                    return <SelectTrigger className={props.className as string}>{children}</SelectTrigger>;
                }
                if (domNode.name === 'motion-select-value') {
                    return <SelectValue placeholder={props.placeholder as string} className={props.className as string} />;
                }
                if (domNode.name === 'motion-select-content') {
                    return <SelectContent className={props.className as string}>{children}</SelectContent>;
                }
                if (domNode.name === 'motion-select-item') {
                    return <SelectItem value={props.value as string} className={props.className as string}>{children}</SelectItem>;
                }
            }
        }
    };

    if (!mounted) {
        return (
            <div className={className} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
        );
    }

    return (
        <div className={className} suppressHydrationWarning>
            {parse(html, options)}
        </div>
    );
};
