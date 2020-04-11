import app from "./app";

app.listen(process.env.PORT || 3001, () => {
  console.log("app running on port ", 3001);
});
