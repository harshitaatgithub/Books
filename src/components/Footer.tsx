import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
const iconSize: number = 30;

const Footer = () => (
  <footer className="bg-gray-100 text-gray-900 p-2 text-center flex justify-center-safe">
    <p className='flex mr-10'>
        <FaFacebook size={iconSize} color="#3b5998" className='cursor:pointer' />
        <FaTwitter size={iconSize} color="#1DA1F2" className='cursor:pointer' />
        <FaInstagram size={iconSize} color="#E4405F" className='cursor:pointer' />
    </p>
    <p className='mr-10'>&copy;2025 Library Corp. All rights reserved.</p>
    <p className='mr-10'><a href='#'>Contact Us</a></p>

  </footer>
);

export default Footer;
