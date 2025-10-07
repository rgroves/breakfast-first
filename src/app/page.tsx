import GamePanel from "./components/GamePanel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>
          Breakfast First - An <strong>Absurdist</strong> Breakfast Adventure
        </h1>
        <GamePanel />
      </main>
      <footer className={styles.footer}>
        <p>
          A submission for CodeTV&apos;s Web Dev Challenge S2.E9 Community
          Hackathon.
        </p>
      </footer>
    </div>
  );
}
