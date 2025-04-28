const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const becrypt = require("bcryptjs");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = prisma.user.findUnique({
        where: {
          id: jwt_payload.sub,
        },
      });
      if (!user) return done(null, false, { message: "User not found" });
      else return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authenticate = passport.authenticate("jwt", { session: false });

module.exports = {
  passport,
  authenticate,
};
