import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { my_projects, my_projects_actu, coding, design, CMS } from './data_projects.min.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
    const divLeft_nav = document.getElementById("divLeft_nav");
    const divLeft_filter = document.getElementById("divLeft_filter");
    const divLeft_overview = document.getElementById("divLeft_overview");
    const filter_cards = document.getElementById("filter_cards");
    const preview_cards = document.getElementById("preview_cards");
    const btnTop = document.getElementById("btnTop")
    const loader = document.getElementById("canvas");
    const tags_input = document.querySelectorAll(".input_filter_tags");
    const all_input = document.getElementById("input_filter_all");
    const container_links = document.querySelectorAll("li.container_links > div > .nav_links");
    const projectsFilter = document.querySelectorAll(".projectsFilter");
    const projectsOverview = document.querySelectorAll(".projectsOverview");
    const contentFilter = document.getElementById("contentFilter");
    const contentOverview = document.getElementById("contentOverview");
    const MenuBurger_enable = document.getElementById("MenuBurger_enable");
    const ol = document.querySelector("header nav ol");
    const iframes = document.querySelectorAll(".iframes_container");
    const btn_iframes_open = document.querySelectorAll(".btn_iframes_open");
    const btn_iframes_close = document.querySelectorAll(".btn_iframes_close");
    const texts_toAnim = document.querySelectorAll(".vague");
    const skills_cards = document.getElementById("skills_cards");
    const skills_sentences = document.getElementById("skills_sentences");

    let displayAll = null;
    let IsTagBlender = null;
    let checked = new Set();

    window.onscroll = function () { scrollToTopBtn() };
    // --- Gestion du Loader - Hors page d'accueil ---

    if (!loader) {
        document.body.style.overflow = "auto";

        // --Animation translate--
        const observer_elements = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show_aperçu");
                }
            });
        }, { threshold: 0.2 });

        const animTranslate = document.querySelectorAll(".animTranslateLeft, .animTranslateRight, .animTranslateBottom, .animTranslateTop")
        animTranslate.forEach((el) => observer_elements.observe(el));
    }
    const Mustang3D = document.getElementById("mustang");
    const QuantixH3D = document.getElementById("quantixH3D")
    const Champis = document.getElementById("champis")

    if (Mustang3D) {
        Mustang3D.style.display = "block"; // Affiche le canvas de la Mustang

        const active_Mustang3D = document.getElementById('active_Mustang3D');
        active_Mustang3D.addEventListener("click", function () {
            const mustangScript = document.createElement("script");
            mustangScript.src = "JS/Mustang3D.js";
            mustangScript.type = "module";
            document.body.appendChild(mustangScript);
            active_Mustang3D.remove();
        });
    }

    if (QuantixH3D) {
        QuantixH3D.style.display = "block"; // Affiche le canvas de la Mustang

        const active_QuantixH3D = document.getElementById('active_QuantixH3D');
        active_QuantixH3D.addEventListener("click", function () {
            const quantixScript = document.createElement("script");
            quantixScript.src = "JS/QuantixH3D.js";
            quantixScript.type = "module";
            document.body.appendChild(quantixScript);
            active_QuantixH3D.remove();
        });
    }

    if (Champis) {
        Champis.style.display = "block"; // Affiche le canvas de la Mustang

        const active_Champis3D = document.getElementById('active_Champis3D');
        active_Champis3D.addEventListener("click", function () {
            const champisScript = document.createElement("script");
            champisScript.src = "JS/champis.js";
            champisScript.type = "module";
            document.body.appendChild(champisScript);
            active_Champis3D.remove();
        });
    }

    // --- Gestion de la Nav ---

    container_links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();  // Empêche le comportement par défaut du lien

            let ul_links = this.closest("li.container_links").querySelector("ul");
            let icon = this.closest("div").querySelector("ion-icon:last-of-type");

            if (ul_links) {
                if (ul_links.style.display === "none" || ul_links.style.display === "") {
                    ul_links.style.display = "flex";
                    if (this.matches("p")) {
                        this.style.color = "var(--new_color_orange)";
                        icon.style.color = "var(--new_color_orange)";
                    }
                    icon.setAttribute("name", "chevron-down-outline");
                } else {
                    ul_links.style.display = "none";
                    if (this.matches("p")) {
                        this.style.color = "white";
                        icon.style.color = "white";
                    }
                    icon.setAttribute("name", "chevron-forward-outline");
                }
            }
        });
    });

    MenuBurger_enable.addEventListener("click", function () {

        if ((contentFilter.style.display === "none" || contentFilter.style.display === "") && (ol.style.display === "none" || ol.style.display === "") && (contentOverview.style.display === "none" || contentOverview.style.display === "")) {
            ol.style.display = "flex";
            divLeft_nav.style.transform = "translateX(0%)";
            MenuBurger_enable.setAttribute("name", "close");
            divLeft_nav.style.boxShadow = "auto"
            console.log("1");
        } else if ((ol.style.display === "none" || ol.style.display === "") && contentFilter.style.display === "flex" && (contentOverview.style.display === "none" || contentOverview.style.display === "")) {
            divLeft_filter.style.transform = "translateX(-100%)";
            MenuBurger_enable.setAttribute("name", "menu");
            document.body.style.overflow = "auto";

            setTimeout(function () {
                contentFilter.style.display = "none";
            }, 400);
            console.log("2");
        } else if ((ol.style.display === "none" || ol.style.display === "") && (contentFilter.style.display === "none" || contentFilter.style.display === "") && contentOverview.style.display === "flex") {
            divLeft_overview.style.transform = "translateX(-100%)";
            ol.style.display = "flex";
            document.body.style.overflow = "auto";

            setTimeout(function () {
                divLeft_nav.style.transform = "translateX(0%)";
                contentOverview.style.display = "none";
                contentOverview.replaceChildren();
            }, 400);
            console.log("3");
        } else {
            divLeft_nav.style.transform = "translateX(-100%)";
            MenuBurger_enable.setAttribute("name", "menu");
            divLeft_nav.style.boxShadow = "none"

            setTimeout(function () {
                ol.style.display = "none";
            }, 400);
            console.log("4");
        }
        document.querySelectorAll("#filter_cards .cards").forEach(card => {
            card.style.display = "block";
        });
        btnTop.style.opacity = "0";
    });

    projectsFilter.forEach(project => {
        project.addEventListener("click", () => {

            if ((contentFilter.style.display === "none" || contentFilter.style.display === "")) {
                document.querySelectorAll("#filter_cards .cards").forEach(card => {
                    card.style.display = "block";
                });
                divLeft_nav.style.transform = "translateX(-100%)";
                btnTop.style.opacity = "0";
                contentFilter.style.display = "flex";
                document.body.style.overflow = "hidden";
                MenuBurger_enable.setAttribute("name", "close");

                setTimeout(function () {
                    ol.style.display = "none";
                    divLeft_filter.style.transform = "translateX(0%)";
                }, 400);
            }
        });
    });

    let projectNameOverview = null;

    projectsOverview.forEach(project => {
        project.addEventListener("click", () => {
            if ((contentFilter.style.display === "none" || contentFilter.style.display === "") && (ol.style.display === "none" || ol.style.display === "") && (contentOverview.style.display === "none" || contentOverview.style.display === "")) {
                document.body.style.overflow = "hidden";
                MenuBurger_enable.setAttribute("name", "close");
            }
            divLeft_nav.style.transform = "translateX(-100%)";
            divLeft_filter.style.transform = "translateX(-100%)";
            contentOverview.style.display = "flex";
            setTimeout(function () {
                ol.style.display = "none";
                divLeft_overview.style.transform = "translateX(0%)";
            }, 400);
            projectNameOverview = project.textContent;
            create_projectsOverview(my_projects, projectNameOverview);
        });
    });

    function create_projectsOverview(my_projects, projectNameOverview) {
        my_projects.forEach(project => {
            if (project.name === projectNameOverview) {
                IsTagBlender = false;
                let cards = document.createElement("div");
                cards.className = "cards";
                cards.style.backgroundImage = `url(${project.src})`;
                cards.style.backgroundPosition = project.bg;
                contentOverview.appendChild(cards);

                let content = document.createElement("div");
                content.className = "content";
                cards.appendChild(content);

                let title_cards = document.createElement("h2");
                title_cards.textContent = project.title;
                content.appendChild(title_cards);

                let infos_cards = document.createElement("p");
                infos_cards.textContent = project.description;
                content.appendChild(infos_cards);

                let techno = document.createElement("div");
                techno.className = "techno";
                techno.textContent = "Technologies utilisées : ";
                content.appendChild(techno);

                let all_tags = document.createElement("div");
                all_tags.className = "all_tags";
                techno.appendChild(all_tags);

                project.tags.forEach(tag => {
                    let tag_cards = document.createElement("p");
                    tag_cards.textContent = tag;
                    tag_cards.className = "tags_cards";

                    switch (tag) {
                        case "HTML":
                            tag_cards.style.backgroundColor = "#E54C21";
                            break;
                        case "CSS":
                            tag_cards.style.backgroundColor = "#254BDE";
                            break;
                        case "JS":
                            tag_cards.style.backgroundColor = "#EFD81D";
                            tag_cards.style.color = "#1c1c1c";
                            break;
                        case "PHP":
                            tag_cards.style.backgroundColor = "#6C7AA8";
                            break;
                        case "Markdown":
                            tag_cards.style.backgroundColor = "black";
                            break;
                        case "Blender":
                            tag_cards.style.backgroundColor = "#EB7700";
                            IsTagBlender = true;
                            break;
                        case "Design":
                            tag_cards.style.backgroundColor = "purple";
                            break;
                        case "Python":
                            tag_cards.style.backgroundColor = "green";
                            break;
                        case "In-Progress":
                            tag_cards.style.backgroundColor = "gray";
                            break;
                    }


                    all_tags.appendChild(tag_cards);
                });

                if (project.url) {
                    let divAccess = document.createElement("div");
                    divAccess.className = "divAccess";
                    divAccess.textContent = "Accès au projet : ";
                    content.appendChild(divAccess);

                    let AccessContent = document.createElement("div");
                    AccessContent.className = "AccessContent";
                    divAccess.appendChild(AccessContent);

                    if (project.urlGitHub) {
                        let buttonGitHub = document.createElement("a");
                        buttonGitHub.href = project.urlGitHub;
                        buttonGitHub.target = "_blank";
                        buttonGitHub.className = "buttonGitHub";
                        AccessContent.appendChild(buttonGitHub);

                        let github = document.createElement("ion-icon");
                        github.setAttribute("name", "logo-github");
                        buttonGitHub.appendChild(github);

                        let textGithub = document.createElement("p");
                        textGithub.textContent = "GitHub Repository";
                        buttonGitHub.appendChild(textGithub);
                    }

                    let link = document.createElement("a");
                    link.href = project.url;
                    IsTagBlender ? link.target = "_self" : link.target = "_blank";
                    console.log(link.target);
                    link.className = "buttonAccess";
                    AccessContent.appendChild(link);

                    let iconLink = document.createElement("ion-icon");
                    iconLink.setAttribute("name", "open-outline");
                    link.appendChild(iconLink);

                    let textLink = document.createElement("p");
                    IsTagBlender ? textLink.textContent = "Voir la page" : textLink.textContent = "Site Web";
                    link.appendChild(textLink);

                }

                IsTagBlender = false;
            }
        });
    }

    // --- Gestion Arrow Up ---
    function scrollToTopBtn() {
        if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && (ol.style.display === "none" || ol.style.display === "") && (contentOverview.style.display === "none" || contentOverview.style.display === "")) {
            btnTop.style.opacity = '1';
        } else {
            btnTop.style.opacity = "0";
        }
    }

    btnTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // --- Gestion Clear Form ---
    window.onbeforeunload = () => {
        for (const form of document.getElementsByTagName('form')) {
            form.reset();
        }
    }

    // --- Gestion des Iframes ---

    btn_iframes_open.forEach((btn) => {
        btn.addEventListener("click", function () {
            iframes.forEach((iframe) => {
                iframe.style.overflow = 'auto';
                iframe.style.pointerEvents = "all";
                iframe.setAttribute("scrolling", "yes");
            });

            iframes.forEach((div) => {
                div.style.filter = "none";
            });

            btn_iframes_open.forEach((btn) => {
                btn.style.display = "none";
            });

            btn_iframes_close.forEach((btn) => {
                btn.style.display = "block";
            });
        });
    });

    btn_iframes_close.forEach((btn) => {
        btn.addEventListener("click", function () {
            iframes.forEach((iframe) => {
                iframe.style.overflow = 'hidden';
                iframe.style.pointerEvents = "none";
                iframe.setAttribute("scrolling", "no");
            });

            iframes.forEach((div) => {
                div.style.filter = "blur(4px)";
            });

            btn_iframes_open.forEach((btn) => {
                btn.style.display = "block";
            });

            btn_iframes_close.forEach((btn) => {
                btn.style.display = "none";
            });
        });
    });

    // --- Gestion Animation Vague Text --- 

    texts_toAnim.forEach(textElement => {
        const text = textElement.textContent.trim();
        textElement.innerHTML = "";

        const fontSize = window.getComputedStyle(textElement).fontSize;

        // Séparation par mot en gardant les espaces consécutifs
        const words = text.split(/(\s+)/); // Inclut les espaces dans le tableau

        words.forEach((word, wordIndex) => {
            if (word.trim() === "") {
                textElement.appendChild(document.createTextNode(" "));
                return;
            }

            const wordSpan = document.createElement("span");
            wordSpan.className = "antiwrap";

            // Ajout de chaque lettre dans le <span>
            word.split("").forEach((letter, letterIndex) => {
                const span = document.createElement("span");
                span.innerHTML = letter;
                span.style.animation = `colorChange 5s ease-in-out infinite`;
                span.style.animationDelay = `${(wordIndex + letterIndex) * 0.1}s`;
                span.style.fontSize = fontSize;
                wordSpan.appendChild(span);
            });

            textElement.appendChild(wordSpan);
        });

        // Boucle d'animation toutes les 1.5 secondes pour chaque élément
        setInterval(() => {
            textElement.querySelectorAll(".antiwrap span").forEach((span, index) => {
                span.style.animationDelay = `${index * 0.1}s`;
            });
        }, 1000);
    });

    // skills
    if (skills_cards) {
        function skills_cardsFunction(tab_skills) {
            tab_skills.forEach(tab_skill => {
                let cards = document.createElement("li");
                cards.className = "cards";

                let img_cards = document.createElement("img");
                img_cards.src = tab_skill.src;
                img_cards.alt = tab_skill.alt;
                cards.appendChild(img_cards);

                let skillName = tab_skill.skill; // skill is a single string
                let name = document.createElement("h4");
                name.textContent = skillName;
                name.className = "tags_cards";

                switch (skillName) {
                    case "HTML":
                        name.style.color = "#E54C21";
                        break;
                    case "CSS":
                        name.style.color = "#1B73BA";
                        break;
                    case "Sass":
                        name.style.color = "#CD6799";
                        break;
                    case "JavaScript":
                        name.style.color = "#D4B830";
                        break;
                    case "PHP":
                        name.style.color = "#6C7AA8";
                        break;
                    case "MySQL":
                        name.style.color = "#00758F";
                        break;
                    case "Three.js":
                        name.style.color = "black";
                        break;
                    case "Git":
                        name.style.color = "#E0672D";
                        break;
                    case "Node.js":
                        name.style.color = "#3F873F";
                        break;
                    case "Express.js":
                        name.style.color = "#323232";
                        break;
                    case "Markdown":
                        name.style.color = "black";
                        break;
                    case "Python":
                        name.style.color = "#3774A8";
                        break;
                    case "Blender":
                        name.style.color = "#EB7700";
                        break;
                    case "WordPress":
                        name.style.color = "#21759B";
                        break;
                }
                cards.appendChild(name);
                skills_cards.appendChild(cards)
            });
        };

        skills_cardsFunction(coding);
        skills_cardsFunction(design);
        skills_cardsFunction(CMS);

        gsap.fromTo(
            "#skills_cards .cards", // Cible toutes les cartes
            {
                opacity: 0,
                y: 50 // Départ légèrement en dessous
            },
            {
                opacity: 1,
                y: 0, // Arrivée à leur position finale
                duration: 0.6,
                stagger: 0.2, // Décalage entre chaque carte
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#skills_cards", // La section contenant les cards
                    start: "top 80%", // Démarre quand le haut de .card-container atteint 80% de la fenêtre
                    end: "bottom 50%", // Fin quand le bas atteint 20%
                    scrub: true, // Pas de scrub, l'animation se joue normalement
                    markers: true, // Montre les marqueurs (à retirer pour la prod)
                    once: true
                }
            }
        );
    }

    if (skills_sentences) {
        function skills_sentencesFunction(tab_skills) {
            tab_skills.forEach(tab_skill => {
                let cards = document.createElement("li");
                cards.className = "cards";

                let img_cards = document.createElement("img");
                img_cards.src = tab_skill.src;
                img_cards.alt = tab_skill.alt;
                cards.appendChild(img_cards);

                let skillName = tab_skill.skill; // skill is a single string
                let name = document.createElement("h4");
                name.textContent = skillName;
                name.className = "tags_cards";

                switch (skillName) {
                    case "HTML":
                        name.style.color = "#E54C21";
                        break;
                    case "CSS":
                        name.style.color = "#1B73BA";
                        break;
                    case "Sass":
                        name.style.color = "#CD6799";
                        break;
                    case "JavaScript":
                        name.style.color = "#D4B830";
                        break;
                    case "PHP":
                        name.style.color = "#6C7AA8";
                        break;
                    case "MySQL":
                        name.style.color = "#00758F";
                        break;
                    case "Three.js":
                        name.style.color = "black";
                        break;
                    case "Git":
                        name.style.color = "#E0672D";
                        break;
                    case "Node.js":
                        name.style.color = "#3F873F";
                        break;
                    case "Express.js":
                        name.style.color = "#323232";
                        break;
                    case "Markdown":
                        name.style.color = "black";
                        break;
                    case "Python":
                        name.style.color = "#3774A8";
                        break;
                    case "Blender":
                        name.style.color = "#EB7700";
                        break;
                    case "WordPress":
                        name.style.color = "#21759B";
                        break;
                }
                cards.appendChild(name);
                skills_sentences.appendChild(cards)
            });
        };

        skills_sentencesFunction(coding);
        skills_sentencesFunction(design);
        skills_sentencesFunction(CMS);


        gsap.set("#skills_sentences li > h4", { transformOrigin: "0 50%" })
        gsap.set("#skills_sentences li:not(:first-of-type) h4", { opacity: 0.2, scale: 0.8 })

        const tl = gsap.timeline()
            .to("#skills_sentences li:not(:first-of-type) h4",
                { opacity: 1, scale: 2, stagger: 0.5 }
            )
            .to("#skills_sentences li:not(:last-of-type) h4",
                { opacity: 1, scale: 1.5, stagger: 0.5 }, 0)


        ScrollTrigger.create({
            trigger: "#skills_sentences li:first-of-type",
            start: "center center",
            endTrigger: "#skills_sentences li:last-of-type",
            end: "+=700",
            pin: false,
            markers: true,
            animation: tl,
            scrub: true,
            once: true, // Arrêter l'animation après la première lecture
        })

    }
    //Configuration hors hébergement GitHub
    // const currentPage = window.location.pathname;

    // if (window.matchMedia("(max-width: 1300px)").matches) {
    //     currentPage.endsWith('projects') ? create_cards(my_projects) : create_cards(my_projects_actu_tel);
    // } else {
    //     currentPage.endsWith('projects') ? create_cards(my_projects) : create_cards(my_projects_actu);
    // }

    // Récupère le slug sans extension ni slash final
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const currentSlug = pathSegments[pathSegments.length - 1] || "index"; // Par défaut, "index" si le chemin est vide

    // Ajustement des projets en fonction de l'écran et du slug
    // if (window.matchMedia("(max-width: 1300px)").matches) {
    //     currentSlug === 'projects' ? create_cards(my_projects) : create_cards(my_projects_actu_tel);
    // } else {
    //     currentSlug === 'projects' ? create_cards(my_projects) : create_cards(my_projects_actu);
    // }

    function create_cards(projects, filter_cards) {

        projects.forEach(project => {
            IsTagBlender = false;

            let cards = document.createElement("div");
            cards.className = "cards";
            cards.style.backgroundImage = `url(${project.src})`;
            cards.style.backgroundPosition = project.bg;

            let content = document.createElement("div");
            content.className = "content";
            cards.appendChild(content);

            let title_cards = document.createElement("h2");
            title_cards.textContent = project.title;
            content.appendChild(title_cards);

            let infos_cards = document.createElement("p");
            infos_cards.textContent = project.description;
            content.appendChild(infos_cards);

            let techno = document.createElement("div");
            techno.className = "techno";
            techno.textContent = "Technologies utilisées : ";
            content.appendChild(techno);

            let all_tags = document.createElement("div");
            all_tags.className = "all_tags";
            techno.appendChild(all_tags);

            project.tags.forEach(tag => {
                let tag_cards = document.createElement("p");
                tag_cards.textContent = tag;
                tag_cards.className = "tags_cards";

                switch (tag) {
                    case "HTML":
                        tag_cards.style.backgroundColor = "#E54C21";
                        break;
                    case "CSS":
                        tag_cards.style.backgroundColor = "#254BDE";
                        break;
                    case "JS":
                        tag_cards.style.backgroundColor = "#EFD81D";
                        tag_cards.style.color = "#1c1c1c";
                        break;
                    case "PHP":
                        tag_cards.style.backgroundColor = "#6C7AA8";
                        break;
                    case "Markdown":
                        tag_cards.style.backgroundColor = "black";
                        break;
                    case "Blender":
                        tag_cards.style.backgroundColor = "#EB7700";
                        IsTagBlender = true;
                        break;
                    case "Design":
                        tag_cards.style.backgroundColor = "purple";
                        break;
                    case "Python":
                        tag_cards.style.backgroundColor = "green";
                        break;
                    case "In-Progress":
                        tag_cards.style.backgroundColor = "gray";
                        break;
                }

                all_tags.appendChild(tag_cards);
            });

            if (project.url) {
                let divAccess = document.createElement("div");
                divAccess.className = "divAccess";
                divAccess.textContent = "Accès au projet : ";
                content.appendChild(divAccess);

                let AccessContent = document.createElement("div");
                AccessContent.className = "AccessContent";
                divAccess.appendChild(AccessContent);

                if (project.urlGitHub) {
                    let buttonGitHub = document.createElement("a");
                    buttonGitHub.href = project.urlGitHub;
                    buttonGitHub.target = "_blank";
                    buttonGitHub.className = "buttonGitHub";
                    AccessContent.appendChild(buttonGitHub);

                    let github = document.createElement("ion-icon");
                    github.setAttribute("name", "logo-github");
                    buttonGitHub.appendChild(github);

                    let textGithub = document.createElement("p");
                    textGithub.textContent = "GitHub Repository";
                    buttonGitHub.appendChild(textGithub);
                }
                let link = document.createElement("a");
                link.href = project.url;
                IsTagBlender ? link.target = "_self" : link.target = "_blank";
                link.className = "buttonAccess";
                AccessContent.appendChild(link);

                let iconLink = document.createElement("ion-icon");
                iconLink.setAttribute("name", "open-outline");
                link.appendChild(iconLink);

                let textLink = document.createElement("p");
                IsTagBlender ? textLink.textContent = "Voir la page" : textLink.textContent = "Site Web";
                link.appendChild(textLink);
            }

            filter_cards.appendChild(cards);
        });
        set_input();
    }

    create_cards(my_projects, filter_cards);
    if (preview_cards) {
        create_cards(my_projects_actu, preview_cards);
    }

    if (all_input) {
        all_input.addEventListener("click", () => {
            document.querySelectorAll(".cards").forEach(card => {
                card.style.display = "block";
            });
            tags_input.forEach(tag_input => {
                let custom_button = tag_input.closest(".custom-button");
                custom_button.classList.remove("active_input");
                tag_input.checked = false;
                checked.add(tag_input.value);
            });
        });
    }

    function set_input() {
        tags_input.forEach(tag_input => {
            tag_input.checked = false;
            checked.add(tag_input.value);
            tag_input.addEventListener("change", () => {
                let custom_button = tag_input.closest(".custom-button");
                if (tag_input.checked) {
                    custom_button.classList.add("active_input");
                    checked.delete(tag_input.value);
                } else {
                    custom_button.classList.remove("active_input");
                    checked.add(tag_input.value);
                }
                check_tags();
                displayAll = true;
            });
        });
    }

    function check_tags() {
        const allUnchecked = Array.from(tags_input).every(tag_input => !tag_input.checked);
        document.querySelectorAll("#filter_cards .cards").forEach(card => {
            let tags_of_card = Array.from(card.querySelectorAll(".tags_cards")).map(tag => tag.textContent);
            let shouldDisplay = tags_of_card.every(tag => checked.has(tag));
            if (allUnchecked) {
                card.style.display = "block";
            } else if (displayAll && checked.size === 10) {
                document.querySelectorAll(".cards").forEach(card => {
                    card.style.display = "block";
                });
                tags_input.forEach(tag_input => {
                    let custom_button = tag_input.closest(".custom-button");
                    custom_button.classList.remove("active_input");
                    tag_input.checked = false;
                    checked.add(tag_input.value);
                });
            } else if (shouldDisplay) {
                card.style.display = "none";
            } else {
                card.style.display = "block";
            }
        });
    }
});
