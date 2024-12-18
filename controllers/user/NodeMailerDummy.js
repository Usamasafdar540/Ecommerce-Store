// forgot password middleware With Node Mailer
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No User Found with this email",
      });
    }

    // Generate a reset token and OTP
    const resetToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Set user properties for password reset
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
    user.otp = otp;
    const result = await user.save();

    // Create the reset password link after generating the token
    // const resetPasswordLink = `http://your-app.com/reset-password/${resetToken}`;

    // Setup the email transport configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.email",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Mail options with the reset password link and OTP included in the email body
    const mailOptions = {
      from: {
        name: "Web Hunter",
        address: process.env.USER,
      },
      // to: "usamasafdar540@gmail.com",
      subject: "Password Reset Link and OTP",
      text: `Use the following OTP to reset your password : Your OTP is: ${otp}`,
    };

    // Send the reset password email
    transporter.sendMail(mailOptions);

    // Include the reset password link and OTP in the response
    return res.status(200).json({
      status: true,
      message: "Reset Password email sent successfully",
      data: result,
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Sending Email",
      error: error.message,
    });
  }
});

// Reset Password Node mailer

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404).json({
        status: false,
        message: "Invalid or expired Reset Token",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.otp = null;

    await user.save();
    return res.status(200).json({
      status: true,
      message: "Password Reset Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in resetting Password",
      error: error.message,
    });
  }
});
