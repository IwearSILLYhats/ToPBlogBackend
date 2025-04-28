const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secret,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = prisma.user.findUnique({
        where: {
          id: jwt_payload.sub,
        },
      });
      if (user) return done(null, user);
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
