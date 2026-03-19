import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
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

const sampleVideos = [
  {
    id: 'aqz-KE-bpKQ',
    title: 'Sample Product Walkthrough',
  },
  {
    id: 'ScMzIvxBSi4',
    title: 'Sample Site Safety Demo',
  },
  {
    id: 'M7lc1UVf-VE',
    title: 'Sample Installation Preview',
  }
]

function GalleryPage() {
  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const rafRef = useRef(0)
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
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 80)
    camera.position.z = 24

    const geometry = new THREE.BufferGeometry()
    const starCount = 1400
    const positionArray = new Float32Array(starCount * 3)
    const colorArray = new Float32Array(starCount * 3)
    const baseY = new Float32Array(starCount)

    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * 80
      const y = (Math.random() - 0.5) * 42
      const z = (Math.random() - 0.5) * 60

      positionArray[i3] = x
      positionArray[i3 + 1] = y
      positionArray[i3 + 2] = z
      baseY[i] = y

      const mix = Math.random()
      colorArray[i3] = 0.2 + mix * 0.4
      colorArray[i3 + 1] = 0.45 + mix * 0.42
      colorArray[i3 + 2] = 0.95
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const onResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    onResize()
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()

    const render = () => {
      rafRef.current = window.requestAnimationFrame(render)
      const t = clock.getElapsedTime()

      const positions = geometry.attributes.position.array
      for (let i = 0; i < starCount; i += 1) {
        positions[i * 3 + 1] = baseY[i] + Math.sin(t * 0.65 + i * 0.19) * 0.18
      }
      geometry.attributes.position.needsUpdate = true

      particles.rotation.y = t * 0.024
      particles.rotation.x = Math.sin(t * 0.22) * 0.08
      material.opacity = 0.78 + Math.sin(t * 0.85) * 0.09

      renderer.render(scene, camera)
    }

    render()

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

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
    <div className="site-wrapper">
      <canvas
        ref={canvasRef}
        className="background-canvas"
        aria-label="Animated spatial particles"
      />
      <div className="bg-overlay" aria-hidden="true" />
      <div className="site-shell">
        <header className="topbar">
          <a className="brand" href="/">
            ← Back to Home
          </a>
          <nav>
            <a href="/">Home</a>
          </nav>
        </header>

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
      </div>
    </div>
  )
}

export default GalleryPage