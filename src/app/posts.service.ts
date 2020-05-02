import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { Post } from "./post";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = new Subject();

  constructor(private http: HttpClient) {}

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("custom", "key");
    // Send Http request
    // we can either create a Subject and subscribe to it if we have multiple components
    // using this service method, but a simpler way is to just return for only one component
    return (
      this.http
        // .get is a generic method to which we can add the type of data between <> brackets
        .get<{ [key: string]: Post }>(
          "https://ng2020-http.firebaseio.com/posts.json",
          {
            headers: new HttpHeaders({ "Custom-Header": "Hello" }),
            params: searchParams,
          }
        )
        .pipe(
          map((responseData) => {
            console.log("responseData: ", responseData);

            const postsArray: Post[] = [];

            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            console.log("posts array: ", postsArray);

            return postsArray;
          }),
          catchError((errorRes) => {
            // Send to analytics server for example
            return throwError(errorRes);
          })
        )
      // .subscribe((postsArray) => {})
      // this was previously in the app.component, we had to subscribe otherwise the http doesn't get sent
      // we don't need this here anymore as we are returning the value and subscribing in the component
    );
  }

  createPost(postData: Post) {
    // Send Http request
    this.http
      // for the type of data in post we only add the name which is generated for the new post
      .post<{ name: string }>(
        "https://ng2020-http.firebaseio.com/posts.json",
        postData,
        {
          observe: "response",
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  getPost(postID: string) {
    this.http
      .get("https://ng2020-http.firebaseio.com/posts.json/" + postID, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .subscribe((post) => {
        console.log(post);
      });
  }

  deletePost(post: Post) {
    // return this.http.delete(
    //   "https://ng2020-http.firebaseio.com/posts.json",
    //   post.id
    // );
  }

  clearPosts() {
    return this.http
      .delete("https://ng2020-http.firebaseio.com/posts.json", {
        observe: "events",
      })
      .pipe(
        tap((event) => {
          // tap enables us to tap into the response object but lets it pass unaffected
          console.log("Tapped events: ", event);
          if (event.type === HttpEventType.Sent) {
            console.log("Request sent");
          }
          if (event.type === HttpEventType.Response) {
            console.log("Response received.");
            console.log(event.body); // should be null because we just deleted all posts
          }
        })
      );
  }
}
