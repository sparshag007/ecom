// import express from "express";
// import passport from "passport";

// const router = express.Router();

// // Route to initiate Google authentication
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback route after Google authentication
// router.get(
//   "/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth/failure",
//     successRedirect: "/",
//   })
// );

// // Failure route
// router.get("/failure", (req, res) => {
//   res.send("Authentication failed!");
// });

// // Logout route
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error during logout");
//     }
//     res.redirect("/");
//   });
// });

// export default router;
