import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

import Image from "next/image";

const client = createClient({
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
})

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: 'post'
  });

  return {
    paths: data.items.map(post => ({
      params: { slug: post.fields.slug }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const data = await client.getEntries({
    content_type: 'post',
    'fields.slug': params.slug
  });

  return {
    props: {
      post: data.items[0]
    },
    revalidate: 1
  }
}

export default function Post({ post }) {
  if (!post) return <div>Error 404</div>;

  return (
    <article>
      <h2>{post.fields.title}</h2>

      <div>
        {documentToReactComponents(post.fields.body, {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: node =>
              <Image
                src={`https:${node.data.target.fields.file.url}`}
                width={node.data.target.fields.file.details.image.width}
                height={node.data.target.fields.file.details.image.height}
              />
          }
        })}
      </div>
    </article>
  )
}
