import Head from 'next/head';
import Link from "next/link";
import { createClient } from "contentful";

const client  = createClient({
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
})

export async function getStaticProps() {
  const data = await client.getEntries({
    content_type: 'post'
  })

  return {
    props: {
      posts: data.items
    }
  }
}

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Next.js Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>NextJS blogs posts</h1>

        <ul>
          {posts.map(post => (
            <li key={post.sys.id}>
              <Link href={`/posts/${post.fields.slug}`}>
                <a>{post.fields.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
