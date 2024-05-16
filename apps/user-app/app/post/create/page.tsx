'use client'

import { FormEvent } from 'react'
import { createPostHandler } from '../../../actions/post'
import  { LinkType, Post, PostType }  from '../../../actions/post/types'
 
export default function Page() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
      
        const formData = new FormData(event.currentTarget)
      
        const post: Post = {
          title: formData.get('title') as string,
          link: formData.get('link') as string,
          linkType: formData.get('linkType') as LinkType, // assuming you have 'linkType' in your form
          description: formData.get('description') as string,
          type:formData.get('type') as PostType// Assuming other properties of Post are present in the form
          // If not, adjust accordingly
        }
      
        const res = await createPostHandler(post)
        console.log('created post')
      
        // Handle response as needed
      }
      
 
      return (
        <form onSubmit={onSubmit}>
          <input type="text" name="title" required />
          <input type="text" name="link" required />
          <select name="linkType" required>
            <option value="youtube">Youtube</option>
            <option value="discord">Discord</option>
          </select>
          <input type="text" name="description" required />
          <select name="type" required>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      )
    
}