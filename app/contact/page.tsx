import ContactForm from "@/components/contactForm/ContactForm";
import { socials } from "@//data/socialsData";
import { address } from "@//data/addressData";
import Lineicons from "@lineiconshq/react-lineicons";
import {
  YoutubeOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TiktokAltOutlined,
  type IconData,
} from "@lineiconshq/free-icons";
import PageTitle from "@/components/pageTitle/PageTitle";

const iconMap: Record<string, IconData> = {
  youtube: YoutubeOutlined,
  facebook: FacebookOutlined,
  instagram: InstagramOutlined,
  tiktok: TiktokAltOutlined,
};

export default function ContactPage() {
  return (
    <section className="page-container flex flex-wrap gap-x-8 gap-y-12 md:gap-y-16 items-end pt-20">
      <PageTitle title="Contact" />
      <ul className="list-none flex gap-3 min-w-1/4">
        {socials.map((social) => {
          const icon = iconMap[social.icon as string];
          return (
            <li key={social.name}>
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex p-5 rounded-full bg-white/20"
                title={social.name}
                aria-label={social.name}
              >
                {icon ? (
                  <Lineicons
                    icon={icon}
                    size="25"
                    className="text-white h-6 motion-safe:group-hover:animate-[bounce_600ms_ease-in-out_1]"
                  />
                ) : (
                  social.name
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="w-full border-y-2 md:border-2  border-white/30 p-6 flex flex-col items-center justify-center">
        <p className="text-white text-lg">
          {address.street}, {address.city} {address.zipCode}, {address.country}
        </p>
        <p>Phone: {address.phone}</p>
        <a href={`mailto:${address.email}`}>Email: {address.email}</a>
      </div>
      <div className="w-full flex justify-center">
        {" "}
        <ContactForm />
      </div>
    </section>
  );
}
