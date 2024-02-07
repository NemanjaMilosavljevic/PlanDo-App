import styles from "./LandingPage.module.css";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { navbarActions } from "../../store/navbar-slice";

const LandingPage = () => {
  const dispatch = useDispatch();
  dispatch(navbarActions.hideNavbarAndHeader());

  const startWithApp = () => {
    dispatch(navbarActions.showNavbarAndHeader());
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles["first-icon"]}>
          <img
            src="Images/PlanDo.png"
            alt="plando icon"
            className={styles["icon-img"]}
          />
        </div>
        <div className={styles["second-icon"]}>
          <img
            src="Images/plndo-dark.svg"
            alt="logo"
            className={styles["icon-img"]}
          />
        </div>
      </nav>
      <div className={styles["bgc-container"]}>
        <div className={styles["orange-container"]}></div>
      </div>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles["main-text"]}>
            <h1>Organize your everyday</h1>
            <p>
              Stay in control of your personal and work life with PlanDo, task
              management app that turns chaos into clarity. Say goodbye to
              scattered to-do lists and hello to a streamlined, organized
              approach to getting things done.
            </p>
            <p>
              Don't let life's demands overwhelm you. Get started today and
              unlock a world of productivity!
            </p>
            <Link to="/">
              <Button
                className={styles.button}
                button={{ onClick: startWithApp }}
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className={styles["main-image"]}></div>
        </section>

        <section className={styles.section}>
          <div className={styles["section-image"]}></div>
          <div className={styles["section-text"]}>
            <h1>Simple task management</h1>
            <p>
              PlanDo transforms your everyday tasks into simple, actionable
              tickets. Whether it's a personal project, a work assignment, or a
              daily chore, our intuitive platform ensures that nothing slips
              through the cracks. With PlanDo, you're always one step ahead. Set
              priorities, deadlines, and reminders to keep your tasks on track.
              Boost productivity and foster teamwork with just a few clicks, so
              you can focus on what matters most without feeling overwhelmed.
            </p>
          </div>
        </section>

        <h1 className={styles["heading-last-section"]}>
          Analitycs that matter
        </h1>
        <section className={styles["last-section"]}>
          <div className={styles["text-container"]}>
            <p>
              Your productivity, visualized. PlanDo's Analytics section offers a
              clear and concise overview of your task performance month by
              month. See at a glance how many tasks you've tackled, what's been
              completed, and what's still on your plate.
            </p>
            <p>
              Charts and graphs make it easy to track your accomplishments and
              identify areas for improvement. Dive deep into your task history
              and make informed decisions with powerful, data-driven insights.
              Start using PlanDo Analytics and watch your progress come to life
              with every click.
            </p>
          </div>
          <div className={styles["last-section-image"]}></div>
        </section>
      </main>

      <div className={styles["bgc-container"]}>
        <div className={styles["black-container"]}></div>
      </div>

      <footer className={styles.footer}>
        <div className={styles["footer-icon"]}>
          <img
            src="Images/logo_text.png"
            alt="plando icon"
            className={styles["icon-img"]}
          />
        </div>
        <p>
          Organize your everyday with simple task management Web Application
        </p>
        <p className={styles.copyright}> &copy; Copyright PlanDo Inc.</p>
      </footer>
    </>
  );
};

export default LandingPage;
