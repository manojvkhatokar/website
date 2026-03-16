import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

const COMPANY_EMAIL = 'sales@metalfabpro.com'
const COMPANY_PHONE = '919876543210'

const services = [
  {
    title: 'CNC Laser Cutting',
    description:
      'Precision sheet and plate cutting for steel, stainless steel, and aluminum with tight tolerances.',
  },
  {
    title: 'Custom Fabrication',
    description:
      'End-to-end fabrication of frames, enclosures, ducts, and structural assemblies built for industry.',
  },
  {
    title: 'Welding & Assembly',
    description:
      'MIG, TIG, and arc welding delivered by certified technicians with strict quality controls.',
  },
  {
    title: 'Surface Finishing',
    description:
      'Powder coating, grinding, polishing, and protective finishing for durability and premium appearance.',
  },
]

const whatsappChatLink = `https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent(
  'Hello MetalFab Pro, I would like to discuss a manufacturing requirement.',
)}`

function App() {
  const canvasRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: services[0].title,
    message: '',
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 180)
    camera.position.set(0, 0, 16)

    const particleCount = 1900
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const baseY = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i += 1) {
      const offset = i * 3

      const x = (Math.random() - 0.5) * 70
      const y = (Math.random() - 0.5) * 30
      const z = (Math.random() - 0.5) * 80

      particlePositions[offset] = x
      particlePositions[offset + 1] = y
      particlePositions[offset + 2] = z
      baseY[i] = y

      const mix = Math.random()
      particleColors[offset] = 0.35 + mix * 0.35
      particleColors[offset + 1] = 0.6 + mix * 0.25
      particleColors[offset + 2] = 1
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3),
    )
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const resizeRenderer = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resizeRenderer()
    window.addEventListener('resize', resizeRenderer)

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      const positions = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3 + 1] = baseY[i] + Math.sin(elapsed * 0.7 + i * 0.21) * 0.16
      }
      particleGeometry.attributes.position.needsUpdate = true

      particles.rotation.y = elapsed * 0.015
      particles.rotation.x = Math.sin(elapsed * 0.11) * 0.05
      particleMaterial.opacity = 0.75 + Math.sin(elapsed * 0.8) * 0.08

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resizeRenderer)
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const emailBody = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Company: ${formData.company || 'N/A'}`,
      `Required Service: ${formData.service}`,
      '',
      'Project Details:',
      formData.message,
    ].join('\n')

    const emailLink = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(
      `Manufacturing Query - ${formData.service}`,
    )}&body=${encodeURIComponent(emailBody)}`

    window.location.href = emailLink
    setStatus(
      'Your email draft has been opened. Please review and send it from your mail app.',
    )
  }

  return (
    <div className="site-wrapper">
      <canvas
        ref={canvasRef}
        className="background-canvas"
        aria-label="Animated industrial background"
      />
      <div className="bg-overlay" aria-hidden="true" />

      <div className="site-shell">
        <header className="topbar reveal">
          <a className="brand" href="#home">
            MetalFab Pro
          </a>
          <nav>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero-section" id="home">
          <div className="hero-copy reveal" style={{ '--reveal-delay': '120ms' }}>
            <p className="tag">Manufacturing & Fabrication Solutions</p>
            <h1>Precision Engineering for Industrial Growth</h1>
            <p>
              We deliver high-quality manufacturing, metal fabrication, and custom
              production services for infrastructure, automotive, and process
              industries.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">
                Request a Quote
              </a>
              <a
                className="btn btn-secondary"
                href={whatsappChatLink}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
          <div className="hero-visual reveal" style={{ '--reveal-delay': '220ms' }}>
            <h3>Core Capabilities</h3>
            <ul className="hero-points">
              <li>Prototype to production support</li>
              <li>Industrial-grade quality checks</li>
              <li>Rapid lead times and dispatch</li>
              <li>Dedicated engineering consultation</li>
            </ul>
          </div>
        </section>

        <section className="section" id="services">
        <h2 className="reveal">Our Services</h2>
        <p className="section-subtitle reveal" style={{ '--reveal-delay': '100ms' }}>
          Built for durability, precision, and production efficiency.
        </p>
        <div className="service-grid">
          {services.map((service, index) => (
            <article
              className="service-card reveal"
              key={service.title}
              style={{ '--reveal-delay': `${160 + index * 80}ms` }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
        </section>

        <section className="section section-alt" id="about">
        <h2 className="reveal">About Us</h2>
        <div className="about-grid">
          <p className="reveal" style={{ '--reveal-delay': '90ms' }}>
            MetalFab Pro is a fabrication-driven manufacturing company focused on
            delivering reliable products with fast turnaround. Our facility blends
            digital fabrication workflows with strict QC standards to ensure each
            component performs in demanding environments.
          </p>
          <ul className="stats">
            <li className="reveal" style={{ '--reveal-delay': '140ms' }}>
              <strong>15+</strong>
              <span>Years of Industry Experience</span>
            </li>
            <li className="reveal" style={{ '--reveal-delay': '220ms' }}>
              <strong>500+</strong>
              <span>Completed Industrial Projects</span>
            </li>
            <li className="reveal" style={{ '--reveal-delay': '300ms' }}>
              <strong>98%</strong>
              <span>On-Time Delivery Record</span>
            </li>
          </ul>
        </div>
        </section>

        <section className="section" id="contact">
        <h2 className="reveal">Contact Us</h2>
        <p className="section-subtitle reveal" style={{ '--reveal-delay': '90ms' }}>
          Share your requirement and our team will connect with you promptly.
        </p>
        <div className="contact-layout">
          <form
            className="contact-form reveal"
            style={{ '--reveal-delay': '160ms' }}
            onSubmit={handleSubmit}
          >
            <label>
              Full Name
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email Address
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Company Name
              <input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
              />
            </label>
            <label>
              Service Needed
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                {services.map((service) => (
                  <option key={service.title} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Project Details
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Material, quantity, drawings, delivery timeline..."
                required
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Send Query via Email
            </button>
            {status && <p className="status-message">{status}</p>}
          </form>

          <aside className="contact-info reveal" style={{ '--reveal-delay': '240ms' }}>
            <h3>Direct Contact</h3>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
            </p>
            <p>
              <strong>Phone:</strong> <a href={`tel:+${COMPANY_PHONE}`}>+{COMPANY_PHONE}</a>
            </p>
            <p>
              <strong>Working Hours:</strong> Mon - Sat, 9:00 AM - 7:00 PM
            </p>
            <a
              className="btn btn-whatsapp"
              href={whatsappChatLink}
              target="_blank"
              rel="noreferrer"
            >
              Start WhatsApp Chat
            </a>
          </aside>
        </div>
        </section>

        <a
          className="whatsapp-float"
          href={whatsappChatLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
        >
          WhatsApp
        </a>

        <footer className="footer reveal" style={{ '--reveal-delay': '100ms' }}>
          © {new Date().getFullYear()} MetalFab Pro • Manufacturing & Fabrication
          Specialists
        </footer>
      </div>
    </div>
  )
}

export default App
