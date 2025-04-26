return (
  // root div
  <div className="min-h-screen flex items-center justify-center  from-toto-light-blue p-4">
    {/* inner div container */}
    <div className="w-full max-w-md">
      {/* form container div */}
      <div className="flex items-center justify-center mb-6 bg-white rounded-xl p-2 shadow-md backdrop-blur-sm">
        <div className="">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="." alt="Toto Logo" className="h-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Sign in to continue your learning journey
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4  py-20">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);

// REGISTER CODE
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-toto-light-blue via-white to-toto-light-orange p-4">
  <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <img
          src="/lovable-uploads/0e30d554-d202-4e68-b80a-383f69221931.png"
          alt="Toto Logo"
          className="h-12"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">Create your account</h2>
      <p className="text-muted-foreground">Start your learning journey today</p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-card"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="pl-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  </div>
</div>;
