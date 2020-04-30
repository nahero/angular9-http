import { Component, OnInit } from "@angular/core";

import { Post } from "./post";
import { PostsService } from "./posts.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsService.createPost(postData);
    console.log(postData);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts) => {
      this.loadedPosts = posts;
      this.isFetching = false;
    });
  }

  onClearPosts() {
    // Send Http request
  }
}
