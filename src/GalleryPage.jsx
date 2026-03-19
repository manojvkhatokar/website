import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import barricade5TImage from './assets/gallery/SCS-Barricade-5T.jpg'
import barricade6Image from './assets/gallery/SCS-Barricade-6.jpg'

const galleryImages = [
  {
    src: barricade5TImage,
    alt: 'SCS Barricade 5T product image',
    title: 'SCS Barricade 5T',
    subtitle: 'Heavy-duty elevator shaft safety barricade',
  },
  {
    src: barricade6Image,
    alt: 'SCS Barricade 6 product image',
    title: 'SCS Barricade 6',
    subtitle: 'High-visibility industrial perimeter barricade',
  },
  {
    src: barricade5TImage,
    alt: 'SCS Barricade 5T angled detail image',
    title: 'Precision MS Fabrication',
    subtitle: 'Rigid profile and reinforced locking geometry',
  },
  {
    src: barricade6Image,
    alt: 'SCS Barricade 6 installation preview image',
    title: 'Rapid Site Deployment',
    subtitle: 'Designed for quick handling and repeat usage',
  },
]

function GalleryPage() {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const closeTimerRef = useRef(0)
  const [activeImage, setActiveImage] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const cards = useMemo(
    () =>
      galleryImages.map((image, index) => ({
        ...image,
        id: `${image.title}-${index}`,
      })),
    [],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      return undefined
    }

    const cardElements = cardRefs.current

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const updateParallax = () => {
      const rect = track.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2

      cardElements.forEach((card) => {
        if (!card) {
          return
        }

        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2
        const distanceFromCenter = (cardCenter - centerX) / rect.width
        const depth = clamp(distanceFromCenter, -1, 1)

        card.style.setProperty('--parallax-shift', `${depth * 80}px`)
        card.style.setProperty('--card-rotate', `${depth * -7}deg`)
      })
    }

    const handleScroll = () => {
      window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    track.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [cards.length])

  useEffect(() => {
    if (!activeImage) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeImage])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const openLightbox = (image) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = 0
    }

    setActiveImage(image)

    window.requestAnimationFrame(() => {
      setIsLightboxOpen(true)
    })
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)

    closeTimerRef.current = window.setTimeout(() => {
      setActiveImage(null)
      closeTimerRef.current = 0
    }, 280)
  }

  return (
    <>
      <section className="section section-alt next-gallery" id="gallery" style={{ marginTop: '1rem' }}>
        <p className="gallery-kicker">Showcase</p>
        <p className="section-subtitle">
          Scroll sideways to view product images.
        </p>

        <div className="parallax-gallery-track" ref={trackRef} aria-label="Product gallery">
          {cards.map((image, index) => (
            <figure
              className="parallax-gallery-card"
              key={image.id}
              role="button"
              tabIndex={0}
              aria-label={`Open ${image.title} image preview`}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              onClick={() => openLightbox(image)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openLightbox(image)
                }
              }}
            >
              <div className="parallax-image-wrap">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </div>
              <figcaption>
                <strong>{image.title}</strong>
                <span>{image.subtitle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div
          className={`gallery-lightbox${isLightboxOpen ? ' is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeImage.title} expanded preview`}
          onClick={closeLightbox}
        >
          <div className="gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="gallery-lightbox-close"
              aria-label="Close expanded image"
              onClick={closeLightbox}
            >
              ×
            </button>
            <img src={activeImage.src} alt={activeImage.alt} />
            <div className="gallery-lightbox-caption">
              <strong>{activeImage.title}</strong>
              <span>{activeImage.subtitle}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default GalleryPage