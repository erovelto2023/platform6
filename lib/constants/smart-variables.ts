export const SMART_VARIABLES = {
    '{{TESTIMONIALS}}': `
        <section class="testimonials-block" style="padding: 80px 20px; background: #f8fafc; font-family: sans-serif;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="text-align: center; font-size: 42px; font-weight: 900; color: #0f172a; margin-bottom: 60px; text-transform: uppercase; letter-spacing: -0.02em;">What Our Members Say</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: white; padding: 40px; border-radius: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 4px; margin-bottom: 20px; color: #fbbf24;">★★★★★</div>
                        <p style="color: #475569; line-height: 1.6; font-style: italic; font-size: 18px; margin-bottom: 30px;">"This completely changed how I approach digital marketing. The results were immediate and massive."</p>
                        <div style="display: flex; items-center; gap: 15px;">
                            <div style="width: 50px; height: 50px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">JD</div>
                            <div>
                                <h4 style="margin: 0; color: #1e293b; font-weight: 900;">John Doe</h4>
                                <span style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Verified Buyer</span>
                            </div>
                        </div>
                    </div>
                    <div style="background: white; padding: 40px; border-radius: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 4px; margin-bottom: 20px; color: #fbbf24;">★★★★★</div>
                        <p style="color: #475569; line-height: 1.6; font-style: italic; font-size: 18px; margin-bottom: 30px;">"The best investment I've made this year. Simple to follow and extremely high value."</p>
                        <div style="display: flex; items-center; gap: 15px;">
                            <div style="width: 50px; height: 50px; background: #8b5cf6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">AS</div>
                            <div>
                                <h4 style="margin: 0; color: #1e293b; font-weight: 900;">Alice Smith</h4>
                                <span style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Marketing Director</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    '{{PRICING_TABLE}}': `
        <section class="pricing-block" style="padding: 100px 20px; background: white; font-family: sans-serif;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <div style="background: #f1f5f9; border: 2px solid #3b82f6; border-radius: 40px; padding: 60px; box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);">
                    <span style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 20px;">Limited Time Offer</span>
                    <h2 style="font-size: 48px; font-weight: 900; color: #0f172a; margin-bottom: 20px; letter-spacing: -0.03em;">{{TITLE}}</h2>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 30px;">
                        <span style="font-size: 24px; color: #94a3b8; text-decoration: line-through;">$197</span>
                        <span style="font-size: 72px; font-weight: 900; color: #1e293b;">\${"{{PRICE}}"}</span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin-bottom: 40px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                        <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #475569; font-weight: 500;">
                            <span style="color: #22c55e;">✔</span> Full Lifetime Access
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #475569; font-weight: 500;">
                            <span style="color: #22c55e;">✔</span> Step-by-Step Video Modules
                        </li>
                        <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #475569; font-weight: 500;">
                            <span style="color: #22c55e;">✔</span> Exclusive Community Access
                        </li>
                    </ul>
                    <a href="{{BUY_URL}}" style="display: block; background: #3b82f6; color: white; padding: 25px; border-radius: 20px; font-size: 20px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);">
                        Get Instant Access Now
                    </a>
                </div>
            </div>
        </section>
    `,
    '{{FAQ}}': `
        <section class="faq-block" style="padding: 80px 20px; font-family: sans-serif;">
            <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="text-align: center; font-size: 32px; font-weight: 900; margin-bottom: 40px;">Frequently Asked Questions</h2>
                <div style="space-y-4">
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-weight: 900; color: #1e293b; margin-bottom: 10px;">Is there a money-back guarantee?</h4>
                        <p style="color: #64748b; line-height: 1.6;">Yes! We offer a 30-day "no questions asked" guarantee. If you're not satisfied, we'll give you a full refund.</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-weight: 900; color: #1e293b; margin-bottom: 10px;">How long do I get access?</h4>
                        <p style="color: #64748b; line-height: 1.6;">You get lifetime access to all current and future updates of this resource.</p>
                    </div>
                </div>
            </div>
        </section>
    `
};
