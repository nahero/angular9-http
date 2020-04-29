import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";
import { Post } from "./post";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    console.log(postData);

    // Send Http request
    this.http
      .post("https://ng2020-http.firebaseio.com/posts.json", postData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    // Send Http request
    this.http
      .get("https://ng2020-http.firebaseio.com/posts.json")
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          console.log("responseData: ", responseData);

          const postsArray = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }

          console.log("posts array: ", postsArray);
        })
      )
      .subscribe((posts) => {
        console.log(posts);
      });
  }
}
