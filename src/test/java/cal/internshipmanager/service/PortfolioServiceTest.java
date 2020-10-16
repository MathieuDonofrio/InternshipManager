package cal.internshipmanager.service;

import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.request.PortfolioDocumentDeleteRequest;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PortfolioServiceTest {

    @Autowired
    private JwtProvider jwtProvider;

    @Mock
    private PortfolioDocumentRepository portfolioDocumentRepository;

    @Test
    public void portfolioDocuments_validRequest() {

        // Arrange

        UUID userUniqueId = UUID.randomUUID();

        PortfolioDocument portfolioDocument = new PortfolioDocument();

        portfolioDocument.setUniqueId(UUID.randomUUID());
        portfolioDocument.setUserUniqueId(userUniqueId);
        portfolioDocument.setFileName("Test1");
        portfolioDocument.setType("Test2");
        portfolioDocument.setFileType("pdf");
        portfolioDocument.setUploadDate(new Date());
        portfolioDocument.setData(new byte[]{1, 2, 3});

        PortfolioService portfolioService = new PortfolioService(portfolioDocumentRepository);

        when(portfolioDocumentRepository.findAllByUserUniqueId(userUniqueId))
                .thenReturn(List.of(portfolioDocument));

        // Act

        PortfolioDocumentListResponse response = portfolioService.portfolioDocuments(userUniqueId);

        PortfolioDocumentListResponse.PortfolioDocument document = response.getPortfolioDocuments().get(0);

        // Assert

        assertEquals(portfolioDocument.getUniqueId(), document.getUniqueId());
        assertEquals(portfolioDocument.getFileName(), document.getFileName());
        assertEquals(portfolioDocument.getFileType(), document.getFileType());
        assertEquals(portfolioDocument.getType(), document.getType());
        assertEquals(portfolioDocument.getUploadDate().getTime(), document.getUploadDate());
        assertTrue(Arrays.equals(portfolioDocument.getData(), document.getData()));
    }

    @Test
    public void upload_validRequest() {

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");
        user.setEmail("toto@gmail.com");
        user.setFirstName("Toto");
        user.setLastName("Tata");

        String token = jwtProvider.generate(user);
        DecodedJWT decodedToken = jwtProvider.verify(token);
        JwtAuthentication authentication = new JwtAuthentication(decodedToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String type = "Test";

        MultipartFile multipartFile = new MultipartFileMock();

        PortfolioService portfolioService = new PortfolioService(portfolioDocumentRepository);

        // Act & Assert

        when(portfolioDocumentRepository.save(any())).then(inv -> {

            PortfolioDocument portfolioDocument = (PortfolioDocument) inv.getArgument(0);

            assertNotNull(portfolioDocument.getUniqueId());
            assertEquals(user.getUniqueId(), portfolioDocument.getUserUniqueId());
            assertEquals(type, portfolioDocument.getType());
            assertEquals(multipartFile.getOriginalFilename(), portfolioDocument.getFileName());
            assertEquals(multipartFile.getContentType(), portfolioDocument.getFileType());
            assertNotNull(portfolioDocument.getUploadDate());
            assertTrue(Arrays.equals(portfolioDocument.getData(), multipartFile.getBytes()));

            return null;
        });

        portfolioService.upload(type, multipartFile);
    }

    @Test
    public void download_validRequest() {

        // Arrange

        PortfolioDocument portfolioDocument = new PortfolioDocument();

        portfolioDocument.setUniqueId(UUID.randomUUID());
        portfolioDocument.setUserUniqueId(UUID.randomUUID());
        portfolioDocument.setFileName("Test1");
        portfolioDocument.setType("Test2");
        portfolioDocument.setFileType("pdf");
        portfolioDocument.setUploadDate(new Date());
        portfolioDocument.setData(new byte[]{1, 2, 3});

        PortfolioService portfolioService = new PortfolioService(portfolioDocumentRepository);

        when(portfolioDocumentRepository.findById(portfolioDocument.getUniqueId()))
                .thenReturn(Optional.of(portfolioDocument));

        // Act

        PortfolioDocument response = portfolioService.download(portfolioDocument.getUniqueId());

        // Assert

        assertEquals(portfolioDocument.getUniqueId(), response.getUniqueId());
        assertEquals(portfolioDocument.getFileName(), response.getFileName());
        assertEquals(portfolioDocument.getFileType(), response.getFileType());
        assertEquals(portfolioDocument.getType(), response.getType());
        assertEquals(portfolioDocument.getUploadDate(), response.getUploadDate());
        assertTrue(Arrays.equals(portfolioDocument.getData(), response.getData()));
    }

    @Test
    public void delete_validRequest() {

        // Arrange

        PortfolioDocument portfolioDocument = new PortfolioDocument();

        portfolioDocument.setUniqueId(UUID.randomUUID());

        PortfolioDocumentDeleteRequest request = new PortfolioDocumentDeleteRequest();

        request.setUniqueId(portfolioDocument.getUniqueId());

        PortfolioService portfolioService = new PortfolioService(portfolioDocumentRepository);

        // Act

        portfolioService.delete(request);
    }

    private static class MultipartFileMock implements MultipartFile {

        @Override
        public String getName() {
            return null;
        }

        @Override
        public String getOriginalFilename() {
            return "Test";
        }

        @Override
        public String getContentType() {
            return "pdf";
        }

        @Override
        public boolean isEmpty() {
            return false;
        }

        @Override
        public long getSize() {
            return 0;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return new byte[]{1, 2, 3};
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return null;
        }

        @Override
        public void transferTo(File file) throws IOException, IllegalStateException {

        }
    }
}
