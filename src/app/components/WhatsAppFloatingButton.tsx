import whatsappLogo from '../../assets/whatsapp-logo.png';

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=595986907575"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar vía WhatsApp"
      className="fixed right-5 bottom-5 z-50 inline-flex items-center justify-center transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#25d366]/60"
    >
      <img
        src={whatsappLogo}
        alt="WhatsApp"
        className="h-auto w-auto max-h-[72px] max-w-[72px] object-contain"
      />
    </a>
  );
}
