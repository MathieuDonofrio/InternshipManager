package cal.internshipmanager.service;

import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

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
        portfolioDocument.setUploadDate(new Date());
        portfolioDocument.setData(new byte[]{1, 2, 3});

        PortfolioService portfolioService = new PortfolioService(portfolioDocumentRepository);

        Mockito.when(portfolioDocumentRepository.findAllByUserUniqueId(userUniqueId))
                .thenReturn(List.of(portfolioDocument));

        // Act

        PortfolioDocumentListResponse response = portfolioService.portfolioDocuments(userUniqueId);

        PortfolioDocumentListResponse.PortfolioDocument document = response.getPortfolioDocuments().get(0);

        // Assert

        assertEquals(portfolioDocument.getUniqueId(), document.getUniqueId());
        assertEquals(portfolioDocument.getFileName(), document.getFileName());
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

        Mockito.when(portfolioDocumentRepository.save(Mockito.any())).then(inv -> {

            PortfolioDocument portfolioDocument = (PortfolioDocument) inv.getArgument(0);

            assertNotNull(portfolioDocument.getUniqueId());
            assertEquals(user.getUniqueId(), portfolioDocument.getUserUniqueId());
            assertEquals(type, portfolioDocument.getType());
            assertEquals(multipartFile.getOriginalFilename(), portfolioDocument.getFileName());
            assertNotNull(portfolioDocument.getUploadDate());
            assertTrue(Arrays.equals(portfolioDocument.getData(), multipartFile.getBytes()));

            return null;
        });

        portfolioService.upload(type, multipartFile);
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
            return null;
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
