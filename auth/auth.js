const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          return done(null, false, {
            message: "That email address does not have an account",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

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
      if (user) return done(null, user);
      else return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authLocal = passport.authenticate("local", { session: false });
const authJwt = passport.authenticate("jwt", { session: false });

function checkVerified(req, res, next) {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    return res.json({ error: "User account not verified" });
  }
}
function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.json({ error: "User account is not authorized" });
  }
}
function checkComment(req, res, next) {
  if (req.user && req.user.canComment) {
    next();
  } else {
    return res.json({
      error: "Account has had commenting priviledges removed",
    });
  }
}

module.exports = {
  passport,
  authLocal,
  authJwt,
  checkVerified,
  checkAdmin,
  checkComment,
};
