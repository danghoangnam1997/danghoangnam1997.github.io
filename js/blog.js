// blog.js
document.addEventListener("DOMContentLoaded", () => {
  // ====== Populate Blog List ======
  const blogList = document.getElementById("blog-list");
  const blogGrid = document.getElementById("blog-grid");
  const latestPosts = document.querySelector("[data-populate='latest-posts']");

  const renderPostCard = (post) => {
    const article = document.createElement("article");
    article.className = "post";
    article.innerHTML = `
      <a href="${post.link}" class="post__thumb">
        <img src="${post.thumbnail}" alt="${post.title}" loading="lazy" />
      </a>
      <div class="post__body">
        <h3 class="post__title"><a href="${post.link}">${post.title}</a></h3>
        <p class="post__meta">${formatDate(post.date)} · ${post.readTime}</p>
        <p class="post__excerpt">${post.excerpt}</p>
        <a href="${post.link}" class="post__readmore">Read more →</a>
      </div>
    `;
    return article;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (blogList) {
    blogList.innerHTML = "";
    window.blogData.forEach((post) => {
      blogList.appendChild(renderPostCard(post));
    });
  }

  if (blogGrid) {
    blogGrid.innerHTML = "";
    window.blogData.forEach((post) => {
      blogGrid.appendChild(renderPostCard(post));
    });
  }

  if (latestPosts) {
    latestPosts.innerHTML = "";
    window.blogData.slice(0, 3).forEach((post) => {
      latestPosts.appendChild(renderPostCard(post));
    });
  }

  // ====== Single Blog Post Loader ======
  const postTitleEl = document.getElementById("post-title");
  const postDateEl = document.getElementById("post-date");
  const postReadTimeEl = document.getElementById("post-readtime");
  const postContentEl = document.getElementById("post-content");

  if (postTitleEl && postContentEl) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    const post = window.blogData.find((p) =>
      p.link.includes(`post=${postId}`)
    );

    if (post) {
      postTitleEl.textContent = post.title;
      postDateEl.textContent = formatDate(post.date);
      postReadTimeEl.textContent = post.readTime;

      // Load markdown content (optional)
      fetch(`/posts/${postId}.md`)
        .then((res) => res.text())
        .then((md) => {
          if (window.marked) {
            postContentEl.innerHTML = window.marked.parse(md);
          } else {
            postContentEl.textContent = md;
          }
        })
        .catch(() => {
          postContentEl.innerHTML =
            "<p>Content not found. Please check back later.</p>";
        });
    } else {
      postContentEl.innerHTML = "<p>Post not found.</p>";
    }
  }
});