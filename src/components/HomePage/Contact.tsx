export default function ContactInfo() {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4 text-[#F4A261] tracking-wide">
        Liên hệ
      </h4>
      <address className="not-italic text-sm leading-relaxed text-[#EDE0D4] font-light">
        <p className="mb-2">Công Viên Phần Mềm Quang Trung, Q.12, TP.HCM</p>
        <p className="mb-2">
          Điện thoại:{" "}
          <span className="text-[#E76F51] font-medium">0367438455</span>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:info@sushi.takumi.vn"
            className="hover:underline text-[#E76F51] font-medium"
          >
            info@sushi.takumi.vn
          </a>
        </p>
      </address>
    </div>
  );
}
