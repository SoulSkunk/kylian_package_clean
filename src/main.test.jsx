import "@testing-library/jest-dom";

test("main app renders without crash", async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await import("./main.jsx");
  await new Promise((resolve) => setTimeout(resolve, 0));

  const root = document.getElementById("root");
  expect(root).not.toBeNull();
  expect(root.textContent).toContain("Prénom");
  expect(root.textContent).toContain("Envoyer");
});
