import { FastifyInstance } from "fastify";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { comparePassword, encryptPassword } from "../utils/crypto";
import * as jwt from "jsonwebtoken";
import { transporter } from "../utils/mail";
import { verifyJWT } from "../utils/jwt";

export async function authentication(app: FastifyInstance) {
    app.post('/register', async (req, res) => {
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string()
        });

        const { name, email, password } = bodySchema.parse(req.body);

        const existingEmail = await prisma.user.findFirst({
            where: { email }
        });

        if (!!existingEmail) return res.code(400).send({
            message: "E-mail already registered. Try another one."
        });

        const registeredUser = await prisma.user.create({
            data: {
                name,
                email,
                password: await encryptPassword(password)
            }
        });

        transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Email confirmation - Authify',
            text: `
                Thank you for subscribing to our platform! We are excited to have you with us.

                Your account has been created successfully. To complete the registration process, please click on the confirmation link below: https://localhost:8000/confirm/${registeredUser.id}

                By confirming your account, you will have full access to our platform's features and functionalities. This is the first step to making the most of everything we offer.
            `,
        }, (err, data) => {
            if (err) return res.code(400).send({
                message: "Unable to send confirmation email. Contact the development team."
            });

            return res.code(201).send({
                message: "User registered successfully. Access your email and confirm it to be able to use the platform.",
            });
        });
    });

    app.get('/confirm/:userId', async (req, res) => {
        const paramsSchema = z.object({ userId: z.string() });

        const { userId } = paramsSchema.parse(req.params);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return res.code(400).send({
            message: "User not registered."
        });

        if (user.confirmedEmail === true) return res.code(400).send({
            message: "Email already confirmed."
        });

        await prisma.user.update({
            where: { id: userId },
            data: { confirmedEmail: true }
        });

        return res.code(200).send({
            message: "Email confirmed successfully."
        });
    });

    app.post('/login', async (req, res) => {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string()
        });

        const { email, password } = bodySchema.parse(req.body);

        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) return res.code(404).send({
            message: "User not found."
        });

        const passwordVerified = await comparePassword(password, user.password);

        if (!passwordVerified) return res.code(401).send({
            message: "Incorrect email or password."
        });

        const token = jwt.sign({ data: user }, process.env.PRIVATE_KEY!, { expiresIn: '2h' });

        return res.code(200).send({
            message: "Login successful.",
            user,
            token
        });
    });

    app.post('/resetpassword', async (req, res) => {
        const bodySchema = z.object({
            email: z.string().email()
        });

        const { email } = bodySchema.parse(req.body);

        const existingEmail = await prisma.user.findFirst({
            where: { email }
        });

        if (!existingEmail) return res.code(400).send({
            message: "Email provided not registered."
        });

        const token = jwt.sign({ email }, process.env.PRIVATE_KEY!, { expiresIn: '1h' });

        transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Reset password - Authify',
            text: `
                We received a request to reset your account password on Authify. If you have not made this request, please ignore this email and your password will remain the same.

                To reset your password, click the link below or copy and paste the URL into your browser:
                
                https://localhost:8000/resetpassword/step-two
                token: ${token}
                
                DO NOT SHARE THE TOKEN WITH ANYONE!

                This link is valid for 1 hour. After this period, you will need to request a new password reset.
                
                If you have any questions or need assistance, please contact us by replying to this email.

                Ps: it's just a Back-End application, with no purpose for front-end integration at the moment.
            `,
        }, (err, data) => {
            if (err) return res.code(400).send({
                message: "Unable to send confirmation email. Contact the development team."
            });

            return res.code(201).send({
                message: "Access your email to reset your password.",
            });
        });
    });

    app.post('/resetpassword/step-two', async (req, res) => {
        const paramsSchema = z.object({
            token: z.string()
        });

        const bodySchema = z.object({
            password: z.string()
        })

        const { token } = paramsSchema.parse(req.query);

        const { password } = bodySchema.parse(req.body);

        const verifiedToken = await prisma.blackListToken.findFirst({
            where: { token }
        });

        if (verifiedToken !== null) return res.code(401).send({
            message: "Token already used."
        });

        const decodedToken = verifyJWT(token);

        if (!decodedToken || !decodedToken.email) return res.code(401).send({
            message: "Invalid token."
        });

        await prisma.user.update({
            where: { email: decodedToken.email },
            data: {
                password: await encryptPassword(password)
            }
        });

        await prisma.blackListToken.create({
            data: { token }
        });

        return res.code(200).send({
            message: "Password updated successfully. Log in."
        });
    });
}