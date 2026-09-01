import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";


const anthropic = new Anthropic();

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message content is required." }, { status: 400 });
        }


        const response = await anthropic.messages.create({
            model: "claude-opus-5",
            max_tokens: 1024,
            system: "You are a helpful customer service chatbot for our Smartcap Catalog.",
            messages: [
                { role: "user", content: message }
            ],
        });


        const replyText = response.content
            .filter((block) => block.type === "text")
            .map((block) => block.text)
            .join("\n");

        return NextResponse.json({ success: true, reply: replyText });

    } catch (error: any) {
        console.error("Anthropic API Cluster Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "An issue occurred on the AI network gateway." },
            { status: 500 }
        );
    }
}
