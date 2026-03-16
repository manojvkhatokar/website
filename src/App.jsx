import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

const COMPANY_EMAIL = 'vkent0924@gmail.com'
const COMPANY_PHONE = '919886041375'
const FACTORY_ADDRESS = ' #41, Ground Floor, 2nd D Cross, Arrekempanahalli, Opp. 10th Cross, Wilson Garden, Bengaluru – 560 027, Karnataka, India'
const OFFICE_ADDRESS = ' #6, 1st Cross, Ashrama Road, Yelachenahalli, Kanakapura Main Road, Bengaluru – 560 078, Karnataka, India'

const services = [
  {
    title: 'MS Double Door Barricades',
    description:
      'Specially designed for lift shaft safety during elevator installation, crowd control, and construction site protection.',
  },
  {
    title: 'MS Scaffolding Systems',
    description:
      'Reliable scaffolding support solutions for residential, commercial, and industrial project requirements.',
  },
  {
    title: 'Elevator Industry Solutions',
    description:
      'Supply and fabrication of templates, checkered plates, T-brackets, lifelines, and other safety components.',
  },
  {
    title: 'Lift Installation Jobs',
    description:
      'Professional execution of elevator installation projects with precision, compliance, and safety-first practices.',
  },
  {
    title: 'Customized MS Fabrication Works',
    description:
      'All types of modern and tailored mild-steel fabrication services designed for diverse client needs.',
  },
  {
    title: 'PAN India Rental & Sale Services',
    description:
      'Nationwide availability for both purchase and rental, ensuring quick deployment wherever your site is located.',
  },
]

const whatsappChatLink = `https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent(
  'Hello MetalFab Pro, I would like to discuss a manufacturing requirement.',
)}`
const mapsQuery = encodeURIComponent(FACTORY_ADDRESS)
const mapsEmbedLink = `https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`
const mapsOpenLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

const officemapsQuery = encodeURIComponent(OFFICE_ADDRESS)
const officemapsEmbedLink = `https://maps.google.com/maps?q=${officemapsQuery}&z=15&output=embed`
const officemapsOpenLink = `https://www.google.com/maps/search/?api=1&query=${officemapsQuery}`

const whyChooseUsPoints = [
  {
    title: 'Quality Assurance',
    description: 'Rigorous safety and durability checks on every product and installation.',
  },
  {
    title: 'Customized Solutions',
    description: 'Tailored execution based on project-specific technical requirements.',
  },
  {
    title: 'Experienced Team',
    description: 'Skilled professionals ensuring reliable service and on-site safety.',
  },
  {
    title: 'Timely Delivery',
    description: 'Prompt supply and installation support to keep projects on track.',
  },
]

const coreValues = [
  {
    title: 'Safety',
    description: 'Prioritizing client and worker well-being in every operation.',
  },
  {
    title: 'Integrity',
    description: 'Transparent and ethical business practices at every stage.',
  },
  {
    title: 'Innovation',
    description: 'Continuous product and service improvement for better results.',
  },
  {
    title: 'Customer Focus',
    description: 'Building long-term partnerships through dependable support.',
  },
]

function MissionVisionPanel() {
  return (
    <section className="section mission-vision-main reveal" style={{ '--reveal-delay': '180ms' }}>
      <h2>Mission & Vision</h2>
      <div className="mission-vision-grid">
        <article className="statement-card">
        <h3>Mission</h3>
        <p>
          To enhance safety and efficiency in construction and elevator
          installation through innovative barricade, scaffolding, and
          fabrication solutions.
        </p>
        </article>

        <article className="statement-card">
        <h3>Vision</h3>
        <p>
          To be India’s leading provider of barricades, scaffolding, and
          fabrication services, recognized for safety, quality, and customer
          satisfaction.
        </p>
        </article>
      </div>
    </section>
  )
}

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
      size: 0.09,
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
            M/s V K ENTERPRISES
          </a>
          <nav>
            <a href="#services">Offerings</a>
            <a href="#about">About</a>
            <a href="#why-us">Why Us</a>
            <a href="#location">Location</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero-section" id="home">
          <div className="hero-copy reveal" style={{ '--reveal-delay': '120ms' }}>
            <h1>Building Safety, Elevating Trust</h1>
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
        </section>

        <section className="section" id="services">
          <h2 className="reveal">Our Offerings</h2>
          <p className="section-subtitle reveal" style={{ '--reveal-delay': '100ms' }}>
            Safety-focused products and execution services for elevator and
            construction industries.
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
              M/s V K ENTERPRISES is a dynamic provider of barricades,
              scaffolding, and MS fabrication solutions across India. We deliver
              innovative, durable, and safe products for construction, event
              management, and industrial applications, with a strong
              specialization in elevator industry requirements.
            </p>
            <div className="about-side">
              <div className="associations reveal" style={{ '--reveal-delay': '220ms' }}>
                <h3>Key Associations</h3>
                <p>Trusted vendor for leading MNC elevator companies:</p>
                <ul>
                  <li>Toshiba Johnson India Pvt Ltd</li>
                  <li>TKE India Pvt Ltd</li>
                  <li>Mitsubishi Elevators India Pvt Ltd</li>
                </ul>
              </div>
            </div>
          </div>
        <MissionVisionPanel />
        </section>

        <section className="section" id="why-us">
          <h2 className="reveal">Why Choose Us?</h2>
          <div className="why-grid">
            {whyChooseUsPoints.map((point, index) => (
              <article
                className="why-card reveal"
                key={point.title}
                style={{ '--reveal-delay': `${100 + index * 80}ms` }}
              >
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>

          <article className="statement-card reveal" style={{ '--reveal-delay': '220ms' }}>
            <h3>Core Values</h3>
            <div className="values-grid">
              {coreValues.map((value) => (
                <div key={value.title} className="value-item">
                  <strong>{value.title}</strong>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>


        <section className="section" id="location">
          <h2 className="reveal">Our Location</h2>
          <p className="section-subtitle reveal" style={{ '--reveal-delay': '90ms' }}>
            Visit our fabrication facility or navigate directly using Google Maps.
          </p>
          <div className="map-layout">
            <div className="map-frame reveal" style={{ '--reveal-delay': '150ms' }}>
              <iframe
                title="MetalFab Pro facility location"
                src={mapsEmbedLink}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <aside className="map-details reveal" style={{ '--reveal-delay': '220ms' }}>
              <h3>Factory Address</h3>
              <p>{FACTORY_ADDRESS}</p>
              <a
                className="btn btn-secondary"
                href={mapsOpenLink}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </aside>
          </div>
          <div className="map-layout">
              <div className="map-frame reveal" style={{ '--reveal-delay': '150ms' }}>
              <iframe
                title="MetalFab Pro facility location"
                src={officemapsEmbedLink}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <aside className="map-details reveal" style={{ '--reveal-delay': '220ms' }}>
              <h3>Office Address</h3>
              <p>{OFFICE_ADDRESS}</p>
              <a
                className="btn btn-secondary"
                href={officemapsOpenLink}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </aside>
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
