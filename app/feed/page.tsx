{(!posts || posts.length === 0) && (
    <p className="text-slate-500">No stories published yet.</p>
  )}

  <div className="space-y-10">
    {posts?.map((post) => {
      const author = Array.isArray(post.author)
        ? post.author[0]
        : post.author;

      return (
        <article key={post.id} className="border-b border-slate-200 pb-8">
          <Link href={`/post/${post.id}`}>
            <h2 className="text-2xl font-serif font-bold mb-2 hover:underline">
              {post.title}
            </h2>
          </Link>

          <p className="text-slate-600 line-clamp-3 mb-3">{post.body}</p>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            {author && (
              <Link
                href={`/profile/${author.handle}`}
                className="font-medium hover:underline"
              >
                {author.display_name || author.handle}
              </Link>
            )}
            {post.published_at && (
              <span>
                ·{" "}
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </article>
      );
    })}
  </div>
</main>
