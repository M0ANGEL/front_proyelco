const PowerBIEmbed = () => {
  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <iframe
        title="Avance Obras"
        width="100%"
        height="800"
        src="https://app.powerbi.com/view?r=eyJrIjoiOTFlZWM5MzctNWUzMi00ZmQ5LWIwODktZmNhYTk1YTY3ZGE5IiwidCI6IjEyMzY1MWQ2LTdkYzEtNDI4OC04YzczLTI3ZjhlN2NiZjllYyJ9"
        frameBorder="0"
        allowFullScreen={true}
        className="rounded-2xl shadow-lg"
      ></iframe>
    </div>
  );
};

export default PowerBIEmbed;