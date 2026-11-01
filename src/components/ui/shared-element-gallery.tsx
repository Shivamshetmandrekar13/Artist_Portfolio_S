"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// --- Types ---
export interface ImageData {
  id: string
  src: string
  alt?: string
}

interface GalleryContextType {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
  renderDetails?: (image: ImageData) => React.ReactNode
}

const GalleryContext = React.createContext<GalleryContextType | null>(null)

// --- Physics ---
const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
} as const

// --- Components ---

/**
 * Root Gallery Provider
 * Manages the state of the expanded image and renders the Modal.
 * Pass `renderDetails` to show an info panel beside the expanded image.
 */
export function Gallery({
  children,
  renderDetails,
}: {
  children: React.ReactNode
  renderDetails?: (image: ImageData) => React.ReactNode
}) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Lock body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedImage])

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage, renderDetails }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  )
}

/**
 * Responsive Masonry Grid
 */
export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Individual Gallery Image Thumbnail
 * `children` render as a caption overlay revealed on hover.
 */
export function GalleryImage({
  src,
  alt,
  id,
  className,
  children,
}: {
  src: string
  alt?: string
  id: string
  className?: string
  children?: React.ReactNode
}) {
  const context = React.useContext(GalleryContext)
  if (!context) throw new Error("GalleryImage must be used within a Gallery")

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative mb-4 break-inside-avoid cursor-zoom-in rounded-xl overflow-hidden",
        className
      )}
      onClick={() => context.setSelectedImage({ id, src, alt })}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || "Gallery Image"}
        className="w-full h-auto object-cover rounded-xl"
        variants={{
          hover: { scale: 0.98 },
          tap: { scale: 0.95 },
        }}
        transition={spring}
      />

      {/* Subtle hover overlay for premium feel */}
      <motion.div
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        className={cn(
          "absolute inset-0 pointer-events-none rounded-xl",
          children
            ? "flex flex-col justify-end p-5 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
            : "bg-black/10"
        )}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Expanded View Modal with Drag-to-Dismiss
 */
function GalleryModal() {
  const context = React.useContext(GalleryContext)
  if (!context) return null

  const { selectedImage, setSelectedImage, renderDetails } = context
  const details = selectedImage && renderDetails ? renderDetails(selectedImage) : null

  return (
    <AnimatePresence>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
        >
          {/* Frosted glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#FFFDF7]/75 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          />

          <div
            className={cn(
              "relative z-10 w-full h-full flex items-center justify-center pointer-events-none",
              details && "flex-col md:flex-row gap-6 p-4 md:p-10 overflow-y-auto md:overflow-hidden"
            )}
          >
            {/* Interactive container for drag gesture */}
            <motion.div
              className={cn(
                "flex items-center justify-center cursor-zoom-out pointer-events-auto",
                details ? "md:flex-1 md:h-full min-h-0 shrink-0" : "w-full h-full"
              )}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                // Dismiss if dragged far enough or fast enough
                if (
                  Math.abs(info.offset.y) > 100 ||
                  Math.abs(info.velocity.y) > 300
                ) {
                  setSelectedImage(null)
                }
              }}
              onClick={() => setSelectedImage(null)}
            >
              {/* The Shared Element */}
              <motion.img
                layoutId={`image-${selectedImage.id}`}
                src={selectedImage.src}
                alt={selectedImage.alt || "Selected gallery image"}
                className={cn(
                  "w-auto h-auto rounded-xl shadow-2xl object-contain will-change-transform",
                  details ? "max-w-full max-h-[55vh] md:max-h-full" : "max-w-[95vw] max-h-[90vh]"
                )}
                draggable={false} // Prevent native drag to allow framer-motion drag
                transition={spring}
              />
            </motion.div>

            {/* Details panel */}
            {details && (
              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="pointer-events-auto w-full md:w-[360px] shrink-0 md:max-h-full md:overflow-y-auto rounded-xl"
              >
                {details}
              </motion.aside>
            )}
          </div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute top-6 right-6 z-50 p-2.5 bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)] rounded-full backdrop-blur-md hover:text-[var(--color-gold)] hover:border-[var(--color-gold-dim)] transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
