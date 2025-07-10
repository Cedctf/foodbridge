import { cn } from "../../lib/utils"
import { Avatar, AvatarImage } from "./avatar"

/**
 * @typedef {Object} TestimonialAuthor
 * @property {string} name - Author's name
 * @property {string} handle - Author's handle/username
 * @property {string} avatar - URL to author's avatar image
 */

/**
 * @typedef {Object} TestimonialCardProps
 * @property {TestimonialAuthor} author - The testimonial author
 * @property {string} text - The testimonial text
 * @property {string} [href] - Optional link for the testimonial
 * @property {string} [className] - Optional additional CSS classes
 */

/**
 * Testimonial Card Component
 * @param {TestimonialCardProps} props
 */
export function TestimonialCard({ 
  author,
  text,
  href,
  className
}) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex w-80 flex-col gap-4 rounded-lg border bg-white p-6 text-left text-sm shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 rounded-full object-cover">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="text-gray-500">{author.handle}</p>
        </div>
      </div>
      <blockquote className="text-gray-700">{`"${text}"`}</blockquote>
    </Card>
  )
}

export { TestimonialAuthor }
