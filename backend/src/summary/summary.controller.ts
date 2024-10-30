import { Controller, Get } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // GET /summary
  @Get()
  async getSummary() {
    // เรียกใช้งาน SummaryService เพื่อดึงข้อมูลสรุป
    return await this.summaryService.getSummary();
  }
}
