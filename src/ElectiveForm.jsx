import { useState } from "react";
import "./ElectiveForm.css";

const departments = ["CSE", "ME", "ECE", "EEE", "PE", "CE", "CHEM", "ARCH"];

const courses = [
  { name: "(CSE)INTRODUCTION TO MACHINE LEARNING", dept: "CSE" },
  { name: "(PE)INDUSTRIAL SAFETY", dept: "PE" },
  { name: "(CHEM)NANOMATERIALS AND NANOTECHNOLOGY", dept: "CHEM" },
  { name: "(EEE)ENERGY EFFICIENCY IN ELECTRICAL ENGINEERING", dept: "EEE" },
  { name: "(EEE)ELECTRIC CHARGING SYSTEM FOR ELECTRIC VEHICLES", dept: "EEE" },
  { name: "(ME)ENTREPRENURSHIP DEVELOPMENT", dept: "ME" },
  { name: "(CE)NATURAL HAZARDS AND IMPACT MANAGEMENT", dept: "CE" },
  { name: "(ARCH)BARRIER FREE BUILT ENVIRONMENT", dept: "ARCH" },
];

export default function ElectiveForm() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [semester, setSemester] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  // Filter logic
  const availableCourses = courses.filter((c) => c.dept !== department);
  const p2Courses = availableCourses.filter((c) => c.name !== p1);
  const p3Courses = availableCourses.filter(
    (c) => c.name !== p1 && c.name !== p2
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const data = {
      Name: name,
      "Roll Number": roll,
      Semester: semester,
      CGPA: cgpa,
      Department: department,
      "Priority-1": p1,
      "Priority-2": p2,
      "Priority-3": p3,
    };

    // ✅ Critical: Use mode: "no-cors" and DO NOT await or read response
    fetch(
      "https://script.google.com/macros/s/AKfycbxv4ghdR0qZEBjFbVD6QgyU3GiiAA3d-RTP363jXEU6w4-qgnJnVcZbiry9DvdpRZOBZQ/exec",
      {
        method: "POST",
        mode: "no-cors", // ← REQUIRED
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then(() => {
        alert("✅ Submitted successfully!");
        // Reset form
        setName("");
        setRoll("");
        setSemester("");
        setCgpa("");
        setDepartment("");
        setP1("");
        setP2("");
        setP3("");
      })
      .catch(() => {
        // This rarely fires with no-cors, but keep for safety
        alert("❌ Submission may have failed. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false); // 👈 Re-enable after response (or failure)
      });
  };

  // Determine if priority selects should be disabled
  const isPriorityDisabled = !department;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Inter-Department Elective Registration</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Roll Number"
        value={roll}
        onChange={(e) => setRoll(e.target.value)}
        required
      />
      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        required
      >
        <option value="">Select Semester</option>
        {["S2", "S3", "S4", "S5", "S6", "S7", "S8"].map((sem) => (
          <option key={sem} value={sem}>
            {sem}
          </option>
        ))}
      </select>
      <input
        placeholder="CGPA"
        value={cgpa}
        onChange={(e) => {
          let value = e.target.value;
          // Remove anything that's not a digit or a single dot
          value = value.replace(/[^0-9.]/g, "");
          // Allow only one dot
          const parts = value.split(".");
          if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
          }
          setCgpa(value);
        }}
        type="text"
        inputMode="decimal"
        required
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Priority 1 */}
      <select
        value={p1}
        onChange={(e) => setP1(e.target.value)}
        required
        disabled={isPriorityDisabled}
      >
        <option value="">
          {isPriorityDisabled ? "Select Department first" : "Priority 1"}
        </option>
        {availableCourses.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Priority 2 */}
      <select
        value={p2}
        onChange={(e) => setP2(e.target.value)}
        required
        disabled={isPriorityDisabled || !p1}
      >
        <option value="">
          {!p1 ? "Select Priority 1 first" : "Priority 2"}
        </option>
        {p2Courses.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Priority 3 */}
      <select
        value={p3}
        onChange={(e) => setP3(e.target.value)}
        required
        disabled={isPriorityDisabled || !p2}
      >
        <option value="">
          {!p2 ? "Select Priority 2 first" : "Priority 3"}
        </option>
        {p3Courses.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <button type="submit">Submit</button>
    </form>
  );
}
