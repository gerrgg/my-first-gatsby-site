import React, { useState } from "react"
import "../sass/style.scss"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

export default function Home({ data }) {
  const [filter, setFilter] = useState("")
  const allPosts = data.allMarkdownRemark.edges.map(post => post.node)

  const postsToShow = !filter
    ? allPosts
    : allPosts.filter(post =>
        post.frontmatter.title.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <Layout>
      <div id="home">
        <Title />
        <Filter filter={filter} setFilter={setFilter} />
        <PostCount count={postsToShow.length} />
        {postsToShow.map(post => {
          return <Post key={post.id} post={post} />
        })}
      </div>
    </Layout>
  )
}

const Filter = ({ filter, setFilter }) => (
  <p>
    Filter: <input onChange={e => setFilter(e.target.value)} value={filter} />
    <button onClick={() => setFilter("")}>Clear</button>
  </p>
)

const Title = () => <h1 className="title">UT Research Articles</h1>
const PostCount = ({ count }) => <h4>{count} Posts</h4>

const Post = ({ post }) => {
  console.log(post)
  return (
    <div className="blog">
      <Link to={post.fields.slug}>
        <h3>
          {post.frontmatter.title} <span>— {post.frontmatter.date}</span>
        </h3>
        <p>{post.excerpt}</p>
        <p className="timeToRead">{post.timeToRead} minute read</p>
      </Link>
    </div>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
          excerpt
          timeToRead
        }
      }
    }
  }
`
