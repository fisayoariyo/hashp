import AgentFormFeedback from "./AgentFormFeedback";

export default function OtpCooldownFeedback({ seconds, className = "" }) {
  if (!seconds || seconds <= 0) return null;

  return (
    <AgentFormFeedback variant="error" className={className}>
      OTP already sent. Try again in {seconds} seconds
    </AgentFormFeedback>
  );
}
