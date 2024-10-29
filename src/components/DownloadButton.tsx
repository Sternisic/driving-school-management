interface DownloadButtonProps {
    handleDownloadPDF: () => void;
  }
  
  const DownloadButton: React.FC<DownloadButtonProps> = ({ handleDownloadPDF }) => {
    return (
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={handleDownloadPDF}
      >
        Kalender als PDF speichern
      </button>
    );
  };
  
  export default DownloadButton;
  