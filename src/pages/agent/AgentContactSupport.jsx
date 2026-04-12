import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { AgentBottomNav } from "./AgentHome";
import { agentData } from "../../mockData/agent";

export default function AgentContactSupport() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState("Profile Update");
  const [farmerId, setFarmerId] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const content = (
    <div className="w-full md:max-w-[862.81px]">
      <h1 className="font-display text-[40px] md:text-[40px] font-bold leading-[48px] text-[#030F0F]">
        Help &amp; Support
      </h1>
      <p className="mt-2 max-w-[760px] text-[14px] leading-[20px] text-[#030F0F]/80">
        Having issues on the field? Reach out to the Hashmar support team for support with farmer
        registration, your profile, or any other concerns.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-[760px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <label className="block">
            <span className="mb-2 block text-[28px] md:text-[20px] font-bold leading-6 text-[#030F0F]">
              Type of issue
            </span>
            <div className="relative">
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="h-[52px] w-full appearance-none rounded-[15px] border border-[#E6E6E6] bg-white px-4 pr-10 text-[14px] text-[#030F0F] outline-none focus:border-[#03624D]"
              >
                <option>Profile Update</option>
                <option>Farmer Sync Issue</option>
                <option>Registration Issue</option>
                <option>Login Issue</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#030F0F]/60">
                &#9662;
              </span>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[28px] md:text-[20px] font-bold leading-6 text-[#030F0F]">
              Farmer ID
            </span>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#030F0F]/55" />
              <input
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder="Enter farmer ID"
                className="h-[52px] w-full rounded-[15px] border border-[#E6E6E6] bg-white pl-10 pr-4 text-[14px] text-[#030F0F] outline-none placeholder:text-[#030F0F]/40 focus:border-[#03624D]"
              />
            </div>
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-[28px] md:text-[20px] font-bold leading-6 text-[#030F0F]">
            Issue description
          </span>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            placeholder="Description of the issue"
            className="h-[153px] w-full resize-none rounded-[15px] border border-[#E6E6E6] bg-white px-4 py-3 text-[14px] text-[#030F0F] outline-none placeholder:text-[#030F0F]/40 focus:border-[#03624D]"
          />
        </label>

        <button
          type="submit"
          className="mt-5 inline-flex h-[47px] w-[187px] items-center justify-center rounded-[15px] bg-[#03624D] text-[20px] font-medium leading-6 text-white"
        >
          Submit
        </button>
      </form>

      <div className="mt-8 w-full max-w-[520px] rounded-[20px] bg-[#FFFFFF] p-5">
        <p className="text-[14px] leading-6 text-[#030F0F]">
          If you experience network issues, contact Hashmar support directly at these phone numbers.
        </p>
        <div className="mt-4 space-y-3 text-[14px] leading-5 text-[#030F0F]">
          <p className="flex items-center gap-2">
            <User size={14} className="text-[#030F0F]" />
            <span>Agent Name: {agentData.fullName}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={14} className="text-[#030F0F]" />
            <span>Phone Number: {agentData.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden min-h-dvh bg-brand-bg-page">
        <div className="px-4 pt-5 pb-28">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-[#030F0F]/70"
          >
            Back
          </button>
          {content}
        </div>
        <AgentBottomNav />
      </div>

      <AgentDesktopShell active="support">{content}</AgentDesktopShell>
    </>
  );
}
