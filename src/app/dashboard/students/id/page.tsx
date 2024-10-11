'use client';

const StudentDetail = ({ params }: { params: { id: string } }) => {
    return <div>Detailansicht für Schüler mit ID: {params.id}</div>;
};

export default StudentDetail;
