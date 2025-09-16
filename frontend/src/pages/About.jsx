import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Left Section */}
      <div className="about-left">
        <h4 className="about-subtitle">How It Started</h4>
        <h1 className="about-title">
          Our Dream is <br /> Global Learning <br /> Transformation
        </h1>
        <p className="about-desc">
          Kawruh was founded by <strong>Robert Anderson</strong>, a passionate
          lifelong learner, and <strong>Maria Sanchez</strong>, a visionary
          educator. Their shared dream was to create a digital haven of
          knowledge accessible to all. United by their belief in the
          transformational power of education, they embarked on a journey to
          build <strong>'Kawruh'</strong>. With relentless dedication, they
          gathered a team of experts and launched this innovative platform,
          creating a global community of eager learners, all connected by the
          desire to explore, learn, and grow.
        </p>

        <p className="about-extra">
          Today, Kawruh empowers <span>students, teachers, and professionals</span> 
          across the world. We provide interactive courses, live sessions, and 
          collaborative tools to make education not just informative, but also 
          inspiring. Our vision is to make quality education a universal right.
        </p>
      </div>

      {/* Right Section */}
      <div className="about-right">
        <img
          src="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2022/03/what-is-a-blog-1.png"
          alt="founders"
          className="about-image"
        />

        <div className="about-stats">
          <div className="stat-card">
            <h2>3.5+</h2>
            <p>Years Experience</p>
          </div>
          <div className="stat-card">
            <h2>23</h2>
            <p>Project Challenges</p>
          </div>
          <div className="stat-card">
            <h2>830+</h2>
            <p>Positive Reviews</p>
          </div>
          <div className="stat-card">
            <h2>100K</h2>
            <p>Trusted Students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
