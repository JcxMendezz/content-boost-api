import { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  async callChatGpt(@Body() body: { prompt: string }, @Res() res: Response) {
    const response = await this.chatgptService.callChatGpt(body.prompt);
    return res.json(response);
  }
}
