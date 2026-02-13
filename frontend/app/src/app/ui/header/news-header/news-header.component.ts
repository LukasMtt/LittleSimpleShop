import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { NewsDTO } from '../../../models/api/news.dto';

@Component({
  selector: 'app-news-header',
  standalone: true,
  imports: [],
  templateUrl: './news-header.component.html',
  styleUrl: './news-header.component.css'
})
export class NewsHeaderComponent implements OnInit {
  newsList: NewsDTO[] = [];
  currentOffset: number = 0;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getAllNews().subscribe((data) => {
      this.newsList = data;
      if (this.newsList) {
        var length = this.newsList.length;
        setInterval(() => {
          this.currentOffset = (this.currentOffset + 1) % length;
        }, 7500);
      }
    });
  }
}
