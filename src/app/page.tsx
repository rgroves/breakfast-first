import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>
          Welcome to <strong>Absurdist</strong> Breakfast Simulator
        </h1>
      </main>
      <footer className={styles.footer}>
        <p>
          A submission for CodeTV's Web Dev Challenge S2.E9 Community Hackathon.
        </p>
      </footer>
    </div>
  );
}
