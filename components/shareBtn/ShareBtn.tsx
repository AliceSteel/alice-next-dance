"use client";

import { useState, useRef, useEffect } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import Button from "../formElements/Btn";

export default function ShareBtn({
  pageId,
  name,
}: {
  pageId: string;
  name: string;
}) {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareUrl = `${websiteUrl}classes/${pageId}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <Button
        variant="secondary"
        label="share"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div
          className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 bg-white/20 border border-gray-200 rounded shadow-lg p-3 flex gap-3"
          role="toolbar"
          aria-label="Share options"
        >
          <FacebookShareButton url={shareUrl} title={name}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrl} title={name}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={shareUrl} title={name}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <EmailShareButton url={shareUrl} subject={name}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      )}
    </div>
  );
}
