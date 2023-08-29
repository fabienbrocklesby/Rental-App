const Footer = () => {
  return (
    <footer className="py-5 bg-primary text-white text-center" style={{ marginTop: "5vh" }}>
      <p className="mb-1">&copy; EZGear 2023</p>
      <p className="mb-0">Contact us at <a href="mailto:support@ezgear.app" className="text-white">support@ezgear.app</a></p>
      <a href="https://www.instagram.com/ezgear2023" target="_blank" rel="noopener noreferrer" className="text-white">
        Follow us on Instagram
      </a><br />
      <div className="mt-3">
        <a href="/termsandcondition" target="_blank" rel="noopener noreferrer" className="text-white">
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
}

export default Footer;
