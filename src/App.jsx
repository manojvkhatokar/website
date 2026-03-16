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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 1.5, 7)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x7aa7ff, 1.2)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0xff8f4a, 1.4, 20)
    rimLight.position.set(-4, 3, -2)
    scene.add(rimLight)

    const factoryGroup = new THREE.Group()
    scene.add(factoryGroup)

    const ringGeometry = new THREE.TorusGeometry(1.35, 0.18, 18, 100)
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f3b59,
      metalness: 0.8,
      roughness: 0.35,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2.2
    factoryGroup.add(ring)

    const coreGeometry = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 28)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d7fb8,
      metalness: 0.55,
      roughness: 0.45,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.y = -0.1
    factoryGroup.add(core)

    const beamGeometry = new THREE.BoxGeometry(0.2, 2.4, 0.2)
    const beamMaterial = new THREE.MeshStandardMaterial({
      color: 0xbcc9e6,
      metalness: 0.7,
      roughness: 0.2,
    })

    const beams = Array.from({ length: 8 }, (_, index) => {
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      const angle = (index / 8) * Math.PI * 2
      beam.position.set(Math.cos(angle) * 1.4, 0, Math.sin(angle) * 1.4)
      beam.rotation.y = angle
      factoryGroup.add(beam)
      return beam
    })

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 0.25, 40),
      new THREE.MeshStandardMaterial({
        color: 0x1a1e2e,
        metalness: 0.4,
        roughness: 0.6,
      }),
    )
    base.position.y = -1.1
    scene.add(base)

    const resizeRenderer = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      if (width === 0 || height === 0) {
        return
      }

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resizeRenderer()
    window.addEventListener('resize', resizeRenderer)

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      ring.rotation.z += 0.012
      core.rotation.y += 0.01
      factoryGroup.rotation.y += 0.004
      beams.forEach((beam, index) => {
        beam.rotation.x = Math.sin((Date.now() * 0.001 + index) * 1.7) * 0.2
      })
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resizeRenderer)
      ringGeometry.dispose()
      ringMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      beamGeometry.dispose()
      beamMaterial.dispose()
      base.geometry.dispose()
      base.material.dispose()
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
    <div className="site-shell">
      <header className="topbar reveal">
        <a className="brand" href="#home">
          Manoj Khatokar
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
          <canvas
            ref={canvasRef}
            className="hero-canvas"
            aria-label="Animated 3D fabrication model"
          />
          <p className="canvas-note">Live 3D process visualization powered by Three.js</p>
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
  )
}

export default App
