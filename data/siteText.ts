type SiteTexts = {
   [key: string]: {
     title: string;
     description: string;
   };
};

export const siteTexts: SiteTexts = {
    homePage: {
        title: "Welcome to Our Dance Studio",
        description: "Discover the joy of dance and express yourself through movement."
    },
    aboutPage: {
        title: "About Us",
        description: "Learn more about our dance studio and our mission."
    },
    classesPage: {
        title: "Our Classes",
        description: "Explore the variety of dance classes we offer for all skill levels."
},
    schedulePage: {
        title: "Class Schedule",
        description: "Find the perfect time for your dance classes."
    },
    contactPage: {
        title: "Contact Us",
        description: "Get in touch with us for more information or to sign up."
    }
}