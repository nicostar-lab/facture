export const Input = ({ value, setvalue, label }) => {
  return (
    <div>
      <label className=" text-xl font-bold">
        {label}
      </label>
      <input
        type="text"
        className="input"
        placeholder="Entrer la consomation.."
        value={value}
        onChange={(e) => setvalue(e.target.value)}
        required
      />
    </div>
  );
};
