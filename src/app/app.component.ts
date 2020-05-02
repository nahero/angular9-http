import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post } from "./post";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsService.createPost(postData);
    console.log(postData);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.error = error.message;
        this.isFetching = false;
      }
    );
  }

  onGetPost(postID: string) {
    this.postsService.getPost(postID);
  }

  onClearPosts() {
    this.postsService.clearPosts().subscribe();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
