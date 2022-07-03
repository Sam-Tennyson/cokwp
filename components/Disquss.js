import {DiscussionEmbed} from "disqus-react"
const DisqusComments = ({ post }) => {
  const disqusShortname = "cokwp"
  const disqusConfig = {
    url: "https://cokwp-1.disqus.com/post-slug",
    // identifier: post.id, // Single post id
    // title: post.title // Single post title
  }
  return (
    <div>
      <DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </div>
  )
}
export default DisqusComments;